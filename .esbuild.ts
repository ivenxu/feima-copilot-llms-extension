/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import * as esbuild from 'esbuild';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const REPO_ROOT = path.dirname(__filename);
const isWatch = process.argv.includes('--watch');
const isDev = process.argv.includes('--dev');

const baseBuildOptions = {
	bundle: true,
	logLevel: 'info',
	minify: !isDev,
	outdir: './dist',
	sourcemap: isDev ? 'linked' : false,
	sourcesContent: false,
	treeShaking: true
} satisfies esbuild.BuildOptions;

const extensionBuildOptions = {
	...baseBuildOptions,
	entryPoints: [
		{ in: './src/extension/extension.ts', out: 'extension' },
	],
	external: [
		'vscode' // the vscode-module is created on-the-fly and must be excluded
	],
	platform: 'node',
	mainFields: ["module", "main"],
	format: 'cjs', // CommonJS format for VS Code extensions
} satisfies esbuild.BuildOptions;

/**
 * Process package.json to substitute region-specific values
 * Replaces %extension.name% and default setting values based on FEIMA_REGION
 */
function processPackageJson() {
	const region = (process.env.FEIMA_REGION || 'cn') as 'cn' | 'global';
	console.log(`[build] Processing package.json for region: ${region}`);
	
	// Read source package.json
	const packageJsonPath = path.join(REPO_ROOT, 'package.json');
	const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
	
	// Read localization file based on region
	const nlsFile = region === 'cn' ? 'package.nls.zh-cn.json' : 'package.nls.json';
	const nlsPath = path.join(REPO_ROOT, nlsFile);
	const nls = JSON.parse(fs.readFileSync(nlsPath, 'utf-8'));
	
	// Read region configuration to get default endpoints
	const regionConfigPath = path.join(REPO_ROOT, 'src', 'config', 'regions.ts');
	const regionConfigContent = fs.readFileSync(regionConfigPath, 'utf-8');
	
	// Extract region-specific defaults (simple regex parsing)
	const regionDefaults = region === 'cn' ? {
		authBaseUrl: 'https://auth.feima.ai/cn',
		apiBaseUrl: 'https://api.feima.ai/cn'
	} : {
		authBaseUrl: 'https://auth.feima.ai/global',
		apiBaseUrl: 'https://api.feima.ai'
	};
	
	// Substitute localized values
	const processedPackage = JSON.parse(JSON.stringify(packageJson));
	
	// Extension name is now fixed to 'copilot-llms-extension'
	// (No longer using %placeholder% notation)
	
	// Update default configuration values based on region
	if (processedPackage.contributes?.configuration?.properties) {
		const props = processedPackage.contributes.configuration.properties;
		if (props['feima.auth.baseUrl']) {
			props['feima.auth.baseUrl'].default = regionDefaults.authBaseUrl;
			console.log(`[build] Set auth.baseUrl default: ${regionDefaults.authBaseUrl}`);
		}
		if (props['feima.api.baseUrl']) {
			props['feima.api.baseUrl'].default = regionDefaults.apiBaseUrl;
			console.log(`[build] Set api.baseUrl default: ${regionDefaults.apiBaseUrl}`);
		}
	}
	
	// Write processed package.json to dist/
	const distPath = path.join(REPO_ROOT, 'dist', 'package.json');
	fs.mkdirSync(path.dirname(distPath), { recursive: true });
	fs.writeFileSync(distPath, JSON.stringify(processedPackage, null, 2), 'utf-8');
	console.log(`[build] Wrote processed package.json to dist/`);
	
	// Copy appropriate localization file to dist/
	const distNlsPath = path.join(REPO_ROOT, 'dist', 'package.nls.json');
	fs.copyFileSync(nlsPath, distNlsPath);
	console.log(`[build] Copied ${nlsFile} to dist/package.nls.json`);
}

async function main() {
	// Process package.json before building
	processPackageJson();
	
	if (isWatch) {
		const context = await esbuild.context(extensionBuildOptions);
		
		console.log('[watch] watching for changes...');
		await context.watch();
		console.log('[watch] build finished, watching for changes...');
		
		// Keep the process alive
		await new Promise(() => {
			// This promise never resolves, keeping the process running
			process.on('SIGINT', async () => {
				console.log('[watch] stopping...');
				await context.dispose();
				process.exit(0);
			});
		});
	} else {
		await esbuild.build(extensionBuildOptions);
		console.log('[build] build complete');
	}
}

main().catch((error) => {
	console.error('[build] build failed:', error);
	process.exit(1);
});
