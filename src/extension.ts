import * as vscode from 'vscode';
import { FeimaAuthProvider } from './auth/feimaAuthProvider';
import { registerAuthCommands } from './commands/authCommands';
import { FeimaLanguageModelProvider } from './models/feimaLanguageModelProvider';

/**
 * Extension activation function.
 * Called when the extension is activated.
 */
export async function activate(context: vscode.ExtensionContext): Promise<void> {
	const outputChannel = vscode.window.createOutputChannel('Feima');
	outputChannel.appendLine('飞码扣 (Feima) extension is activating...');

	try {
		// 1. Register authentication provider
		const authProvider = new FeimaAuthProvider(context, outputChannel);
		context.subscriptions.push(
			vscode.authentication.registerAuthenticationProvider(
				'feima',
				'Feima (飞码扣)',
				authProvider,
				{ supportsMultipleAccounts: false }
			)
		);
		
		// Register as URI handler (for OAuth callbacks)
		context.subscriptions.push(
			vscode.window.registerUriHandler(authProvider)
		);
		outputChannel.appendLine('[Init] ✅ Authentication provider registered');

		// 2. Register commands
		registerAuthCommands(context, authProvider, outputChannel);
		outputChannel.appendLine('[Init] ✅ Commands registered');

		// 3. Register language model provider (Phase 0 - Week 1-2)
	outputChannel.appendLine('');
	outputChannel.appendLine('=== LANGUAGE MODEL PROVIDER REGISTRATION ===');
	
	if (!vscode.lm) {
		outputChannel.appendLine('❌ Language Model API (vscode.lm) not available!');
		outputChannel.appendLine('⚠️  This requires VS Code 1.85.0 or later with Copilot Chat installed.');
		vscode.window.showWarningMessage('Language Model API not available. Please ensure GitHub Copilot Chat is installed.');
	} else {
		outputChannel.appendLine('✅ Language Model API available');
		outputChannel.appendLine(`   vscode.lm methods: ${Object.keys(vscode.lm).join(', ')}`);
		
		outputChannel.appendLine('');
		outputChannel.appendLine('📦 Creating FeimaLanguageModelProvider...');
		const modelProvider = new FeimaLanguageModelProvider(authProvider, outputChannel);
		
		outputChannel.appendLine('📝 Registering provider with vendor ID "feima"...');
		const providerDisposable = vscode.lm.registerLanguageModelChatProvider('feima', modelProvider);
		context.subscriptions.push(providerDisposable);
		context.subscriptions.push(modelProvider);
		outputChannel.appendLine('✅ Language model provider registered successfully');
		outputChannel.appendLine('   Vendor ID: feima');
		outputChannel.appendLine('   Provider will be queried when Copilot Chat needs model list');
		outputChannel.appendLine('===========================================');
	}
		// 4. TODO: Initialize quota service (deferred to post-validation)

		outputChannel.appendLine('✅ 飞码扣 (Feima) extension activated successfully!');
		outputChannel.appendLine('📊 Status: Phase 0 - Feature 1 (Authentication) COMPLETE, Feature 2 (Models) COMPLETE');
		outputChannel.appendLine('🎯 Next: Test model integration with Copilot Chat');
		outputChannel.appendLine('');
		outputChannel.appendLine('💡 Try: Ctrl+Shift+P → "Feima: 登录" then open GitHub Copilot Chat');
	} catch (error) {
		outputChannel.appendLine(`❌ Failed to activate extension: ${error}`);
		vscode.window.showErrorMessage(`飞码扣启动失败: ${error}`);
		throw error;
	}
}

/**
 * Extension deactivation function.
 * Called when the extension is deactivated.
 */
export function deactivate(): void {
	// Cleanup resources if needed
}
