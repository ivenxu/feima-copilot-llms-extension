/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *  Adapted from feima-code FeimaAuthProvider - simplified without dependency injection.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { OAuth2Service, ITokenResponse } from './oauth2Service';

/**
 * Stored token data in VS Code secrets
 */
interface IStoredTokenData {
	tokenResponse: ITokenResponse;
	issuedAt: number;
	sessionId: string;
	accountId: string;
	accountLabel: string;
}

/**
 * Pending OAuth callback resolver
 */
interface IPendingCallback {
	resolve: (result: { code: string } | { error: string }) => void;
	timeoutId: NodeJS.Timeout;
}

/**
 * Feima authentication provider implementing VS Code AuthenticationProvider.
 * Handles OAuth2 + PKCE flow, session management, and token refresh.
 */
export class FeimaAuthProvider implements vscode.AuthenticationProvider, vscode.UriHandler {
	private readonly _onDidChangeSessions = new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
	readonly onDidChangeSessions = this._onDidChangeSessions.event;

	private readonly _secretsKey = 'feimaAuth.tokens';
	private readonly _oauth2Service: OAuth2Service;
	private readonly _pendingCallbacks = new Map<string, IPendingCallback>();
	private _cachedSessions: vscode.AuthenticationSession[] = [];
	private readonly _redirectUri: string;
	private readonly _outputChannel: vscode.OutputChannel;

	constructor(
		private readonly _context: vscode.ExtensionContext,
		outputChannel: vscode.OutputChannel
	) {
		this._oauth2Service = new OAuth2Service();
		this._outputChannel = outputChannel;
		
		// Construct redirect URI: vscode://feima.cn-model-for-copilot/oauth/callback
		this._redirectUri = `${vscode.env.uriScheme}://feima.cn-model-for-copilot/oauth/callback`;
		
		// Load stored sessions on startup
		this._loadStoredSessions();
	}

	/**
	 * Handle OAuth callback URI from feima-idp
	 */
	async handleUri(uri: vscode.Uri): Promise<void> {
		this._outputChannel.appendLine(`[Auth] Received OAuth callback: ${uri.toString()}`);

		try {
			// Parse query parameters
			const query = uri.query;
			const params = new URLSearchParams(query);
			const state = params.get('state');

			if (!state) {
				this._outputChannel.appendLine('[Auth] ERROR: Missing state in callback');
				return;
			}

			// Find pending callback for this state
			const pending = this._pendingCallbacks.get(state);
			if (!pending) {
				this._outputChannel.appendLine(`[Auth] WARN: No pending callback for state=${state}`);
				return;
			}

			// Remove from pending map
			this._pendingCallbacks.delete(state);
			clearTimeout(pending.timeoutId);

			// Validate callback
			const result = this._oauth2Service.validateCallback(query);
			pending.resolve(result);

this._outputChannel.appendLine(`[Auth] Callback validated successfully`);
		} catch (error) {
			this._outputChannel.appendLine(`[Auth] ERROR handling callback: ${error}`);
		}
	}

	/**
	 * Get existing sessions
	 */
	async getSessions(
		_scopes?: readonly string[],
		_options?: vscode.AuthenticationProviderSessionOptions
	): Promise<vscode.AuthenticationSession[]> {
		// Check if cached sessions need refresh
		if (this._cachedSessions.length > 0) {
			const stored = await this._loadStoredToken();
			if (stored) {
				// Check if token needs refresh
				if (this._oauth2Service.shouldRefreshToken(stored.tokenResponse, stored.issuedAt) && stored.tokenResponse.refresh_token) {
					try {
						this._outputChannel.appendLine('[Auth] Refreshing expired token');
						const refreshed = await this._oauth2Service.refreshAccessToken(stored.tokenResponse.refresh_token);
						
						// Preserve refresh token if not returned
						if (!refreshed.refresh_token) {
							refreshed.refresh_token = stored.tokenResponse.refresh_token;
						}

						await this._saveToken(refreshed, stored.accountId, stored.accountLabel, stored.sessionId);

						// Update cached session
						this._cachedSessions = [{
							id: stored.sessionId,
							accessToken: refreshed.access_token,
							account: {
								id: stored.accountId,
								label: stored.accountLabel
							},
							scopes: []
						}];
					} catch (error) {
						this._outputChannel.appendLine(`[Auth] Token refresh failed: ${error}`);
						await this._clearStoredToken();
						this._cachedSessions = [];
						return [];
					}
				}
			} else {
				this._cachedSessions = [];
			}
		}

		return this._cachedSessions;
	}

	/**
	 * Create a new session with OAuth2 flow
	 */
	async createSession(
		_scopes: readonly string[],
		_options?: vscode.AuthenticationProviderSessionOptions
	): Promise<vscode.AuthenticationSession> {
		this._outputChannel.appendLine('[Auth] Starting OAuth2 flow');

		// Build authorization URL
		const authUrl = await this._oauth2Service.buildAuthorizationUrl(this._redirectUri);

		// Extract state/nonce to register pending callback
		const urlObj = new URL(authUrl);
		const state = urlObj.searchParams.get('state');
		if (!state) {
			throw new Error('Failed to generate OAuth2 state');
		}

		// Open browser
		const opened = await vscode.env.openExternal(vscode.Uri.parse(authUrl));
		if (!opened) {
			throw new Error('Failed to open authentication URL');
		}

		this._outputChannel.appendLine('[Auth] Opened browser, waiting for callback...');

		// Wait for callback with timeout
		const result = await new Promise<{ code: string } | { error: string }>((resolve) => {
			const timeoutId = setTimeout(() => {
				if (this._pendingCallbacks.has(state)) {
					this._pendingCallbacks.delete(state);
					resolve({ error: 'Authentication timed out after 5 minutes' });
				}
			}, 5 * 60 * 1000);

			this._pendingCallbacks.set(state, { resolve, timeoutId });
		});

		if ('error' in result) {
			throw new Error(`Authentication failed: ${result.error}`);
		}

		this._outputChannel.appendLine('[Auth] Received authorization code, exchanging for token...');

		// Exchange code for token
		const tokenResponse = await this._oauth2Service.exchangeCodeForToken(result.code);

		// Extract user info
		const userInfo = this._oauth2Service.getUserInfo(tokenResponse);
		const accountId = userInfo?.sub || `user-${Date.now()}`;
		const accountLabel = userInfo?.email || userInfo?.name || 'Feima User';

		// Generate session ID
		const sessionId = `feima-session-${Date.now()}`;

		// Save token
		await this._saveToken(tokenResponse, accountId, accountLabel, sessionId);

		const session: vscode.AuthenticationSession = {
			id: sessionId,
			accessToken: tokenResponse.access_token,
			account: {
				id: accountId,
				label: accountLabel
			},
			scopes: []
		};

		this._cachedSessions = [session];

		// Fire event
		this._onDidChangeSessions.fire({
			added: [session],
			removed: [],
			changed: []
		});

		this._outputChannel.appendLine(`[Auth] Session created successfully for ${accountLabel}`);
		return session;
	}

	/**
	 * Remove a session (sign out)
	 */
	async removeSession(sessionId: string): Promise<void> {
		this._outputChannel.appendLine(`[Auth] Removing session: ${sessionId}`);

		const stored = await this._loadStoredToken();
		if (!stored || stored.sessionId !== sessionId) {
			return;
		}

		const session: vscode.AuthenticationSession = {
			id: stored.sessionId,
			accessToken: stored.tokenResponse.access_token,
			account: {
				id: stored.accountId,
				label: stored.accountLabel
			},
			scopes: []
		};

		// Clear token
		await this._clearStoredToken();
		this._cachedSessions = [];

		// Fire event
		this._onDidChangeSessions.fire({
			added: [],
			removed: [session],
			changed: []
		});

		this._outputChannel.appendLine('[Auth] Session removed');
	}

	// ============ Private Helpers ============

	private async _loadStoredSessions(): Promise<void> {
		const stored = await this._loadStoredToken();
		if (stored) {
			this._cachedSessions = [{
				id: stored.sessionId,
				accessToken: stored.tokenResponse.access_token,
				account: {
					id: stored.accountId,
					label: stored.accountLabel
				},
				scopes: []
			}];
		}
	}

	private async _loadStoredToken(): Promise<IStoredTokenData | undefined> {
		const stored = await this._context.secrets.get(this._secretsKey);
		if (!stored) {
			return undefined;
		}

		try {
			return JSON.parse(stored) as IStoredTokenData;
		} catch (error) {
			this._outputChannel.appendLine(`[Auth] Failed to parse stored token: ${error}`);
			return undefined;
		}
	}

	private async _saveToken(
		tokenResponse: ITokenResponse,
		accountId: string,
		accountLabel: string,
		sessionId: string
	): Promise<void> {
		const data: IStoredTokenData = {
			tokenResponse,
			issuedAt: Date.now(),
			sessionId,
			accountId,
			accountLabel
		};

		await this._context.secrets.store(this._secretsKey, JSON.stringify(data));
	}

	private async _clearStoredToken(): Promise<void> {
		await this._context.secrets.delete(this._secretsKey);
	}
}
