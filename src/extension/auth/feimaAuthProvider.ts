/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *  Adapted from feima-code FeimaAuthProvider - thin adapter pattern.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { IFeimaAuthenticationService } from '../platform/authentication/common/feimaAuthentication';
import { ILogService } from '../platform/log/common/logService';

/**
 * Feima authentication provider - thin VS Code adapter.
 * Delegates all logic to IFeimaAuthenticationService.
 *
 * Architecture:
 * - FeimaAuthenticationService: Heavy implementation (OAuth2, session management, secrets)
 * - FeimaAuthProvider (this class): Thin VS Code adapter that implements AuthenticationProvider interface
 * - Other services: Inject IFeimaAuthenticationService via getToken/isAuthenticated
 *
 * This adapter pattern separates VS Code-specific concerns from testable authentication logic.
 */
export class FeimaAuthProvider implements vscode.AuthenticationProvider, vscode.UriHandler {
	readonly onDidChangeSessions: vscode.Event<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>;

	constructor(
		private readonly _authService: IFeimaAuthenticationService,
		private readonly _logService: ILogService
	) {
		// Delegate event from service
		this.onDidChangeSessions = this._authService.onDidChangeSessions;
		this._logService.info('[FeimaAuthProvider] Thin adapter initialized with multi-request support');
	}

	/**
	 * Handle OAuth callback URI from feima-idp
	 */
	async handleUri(uri: vscode.Uri): Promise<void> {
		return this._authService.handleUri(uri);
	}

	/**
	 * Get existing sessions
	 */
	async getSessions(
		scopes?: readonly string[],
		options?: vscode.AuthenticationProviderSessionOptions
	): Promise<vscode.AuthenticationSession[]> {
		return this._authService.getSessions(scopes, options || {});
	}

	/**
	 * Create a new session with OAuth2 flow
	 */
	async createSession(
		scopes: readonly string[],
		options?: vscode.AuthenticationProviderSessionOptions
	): Promise<vscode.AuthenticationSession> {
		return this._authService.createSession(scopes, options || {});
	}

	/**
	 * Remove a session (sign out)
	 */
	async removeSession(sessionId: string): Promise<void> {
		return this._authService.removeSession(sessionId);
	}

	/**
	 * Get cached sessions synchronously (non-blocking)
	 */
	getCachedSessions(): vscode.AuthenticationSession[] {
		return this._authService.getCachedSessions();
	}
}
