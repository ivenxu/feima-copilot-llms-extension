/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import * as esbuild from 'esbuild';

const REPO_ROOT = import.meta.dirname;
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
		{ in: './src/extension.ts', out: 'extension' },
	],
	external: [
		'vscode' // the vscode-module is created on-the-fly and must be excluded
	],
	platform: 'node',
	mainFields: ["module", "main"],
	format: 'cjs', // CommonJS format for VS Code extensions
} satisfies esbuild.BuildOptions;

async function main() {
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
