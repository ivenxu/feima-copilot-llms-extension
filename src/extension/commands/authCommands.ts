/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { FeimaAuthenticationService } from '../platform/authentication/vscode/feimaAuthenticationService';
import { ILogService } from '../platform/log/common/logService';

/**
 * Register all authentication-related commands
 */
export function registerAuthCommands(
	context: vscode.ExtensionContext,
	authService: FeimaAuthenticationService,
	logService: ILogService
): void {
	// Sign In command
	context.subscriptions.push(
		vscode.commands.registerCommand('feima.signIn', async () => {
			logService.info('feima.signIn triggered');
			
			try {
				// Directly call createSession instead of using VS Code API
				// This allows multiple concurrent sign-in attempts (user can retry if browser closes)
				const session = await authService.createSession([], {});
				
				vscode.window.showInformationMessage(
					`✅ 已登录为: ${session.account.label}`
				);
				logService.info(`Sign in successful: ${session.account.label}`);
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				vscode.window.showErrorMessage(`❌ 登录失败: ${errorMsg}`);
				logService.error(error as Error, 'Sign in failed');
			}
		})
	);

	// Sign Out command
	context.subscriptions.push(
		vscode.commands.registerCommand('feima.signOut', async () => {
			logService.info('feima.signOut triggered');
			
			try {
				await authService.signOut();
				vscode.window.showInformationMessage('✅ 已登出 Feima 账号');
				logService.info('Sign out successful');
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				vscode.window.showErrorMessage(`❌ 登出失败: ${errorMsg}`);
				logService.error(error as Error, 'Sign out failed');
			}
		})
	);

	// Show Account command
	context.subscriptions.push(
		vscode.commands.registerCommand('feima.showAccount', async () => {
			logService.info('feima.showAccount triggered');
			
			try {
				// Get sessions from auth service directly
				const sessions = await authService.getSessions([], {});
				
				if (sessions.length === 0) {
					vscode.window.showWarningMessage('⚠️ 请先登录 Feima 账号');
					logService.info('No active session');
					return;
				}
				
				const session = sessions[0];
				
				// Show account details in quick pick
				const info = `当前账号: ${session.account.label}\n账号 ID: ${session.account.id}`;
				vscode.window.showInformationMessage(info);
				logService.info(info);
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : String(error);
				vscode.window.showErrorMessage(`❌ 获取账号信息失败: ${errorMsg}`);
				logService.error(error as Error, 'Get account failed');
			}
		})
	);

	logService.info('Registered: feima.signIn, feima.signOut, feima.showAccount');
}
