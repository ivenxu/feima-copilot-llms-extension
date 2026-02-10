/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { FeimaAuthProvider } from '../auth/feimaAuthProvider';

/**
 * Register authentication-related commands.
 */
export function registerAuthCommands(
	context: vscode.ExtensionContext,
	authProvider: FeimaAuthProvider,
	outputChannel: vscode.OutputChannel
): void {
	// Sign In command
	context.subscriptions.push(
		vscode.commands.registerCommand('feima.signIn', async () => {
			outputChannel.appendLine('[Command] feima.signIn triggered');
			
			try {
				const session = await vscode.authentication.getSession(
					'feima',
					[],
					{ createIfNone: true }
				);
				
				vscode.window.showInformationMessage(
					`✅ 已登录为: ${session.account.label}`
				);
				outputChannel.appendLine(`[Command] Sign in successful: ${session.account.label}`);
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				vscode.window.showErrorMessage(`❌ 登录失败: ${errorMsg}`);
				outputChannel.appendLine(`[Command] Sign in failed: ${errorMsg}`);
			}
		})
	);

	// Sign Out command
	context.subscriptions.push(
		vscode.commands.registerCommand('feima.signOut', async () => {
			outputChannel.appendLine('[Command] feima.signOut triggered');
			
			try {
				const sessions = await authProvider.getSessions();
				if (sessions.length > 0) {
					await authProvider.removeSession(sessions[0].id);
					vscode.window.showInformationMessage('✅ 已登出 Feima 账号');
					outputChannel.appendLine('[Command] Sign out successful');
				} else {
					vscode.window.showInformationMessage('ℹ️ 未登录任何账号');
					outputChannel.appendLine('[Command] No session to sign out');
				}
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				vscode.window.showErrorMessage(`❌ 登出失败: ${errorMsg}`);
				outputChannel.appendLine(`[Command] Sign out failed: ${errorMsg}`);
			}
		})
	);

	// Show Account command
	context.subscriptions.push(
		vscode.commands.registerCommand('feima.showAccount', async () => {
			outputChannel.appendLine('[Command] feima.showAccount triggered');
			
			try {
				const session = await vscode.authentication.getSession(
					'feima',
					[],
					{ createIfNone: false }
				);
				
				if (!session) {
					vscode.window.showWarningMessage('⚠️ 请先登录 Feima 账号');
					outputChannel.appendLine('[Command] No active session');
					return;
				}
				
				// Show account details in quick pick
				const info = `当前账号: ${session.account.label}\n账号 ID: ${session.account.id}`;
				vscode.window.showInformationMessage(info);
				outputChannel.appendLine(`[Command] ${info}`);
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				vscode.window.showErrorMessage(`❌ 获取账号信息失败: ${errorMsg}`);
				outputChannel.appendLine(`[Command] Get account failed: ${errorMsg}`);
			}
		})
	);

	outputChannel.appendLine('[Commands] Registered: feima.signIn, feima.signOut, feima.showAccount');
}
