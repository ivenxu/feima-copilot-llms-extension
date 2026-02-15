/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *  Adapted from feima-code FeimaAuthenticationService.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { IFeimaAuthenticationService } from '../common/feimaAuthentication';
import { OAuth2Service, ITokenResponse, IAuthorizationUrl } from '../../../auth/oauth2Service';
import { FeimaUriEventHandler, ICallbackData } from '../common/feimaUriEventHandler';
import { ILogService } from '../../log/common/logService';

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
 * Active OAuth2 flow state (for multi-request support).
 */
interface IActiveFlow {
	nonce: string;
	codeVerifier: string;
	redirectUri: string;
}

/**
 * Feima authentication service - heavy implementation with OAuth2, session management, and secrets storage.
 *
 * This service is the "engine" that manages all authentication state. It:
 * - Performs OAuth2 + PKCE flow
 * - Manages session storage in VS Code secrets
 * - Handles token refresh automatically
 * - Provides both consumer methods (getToken, isAuthenticated) and provider methods (getSessions, createSession)
 *
 * Architecture:
 * - FeimaAuthenticationService (this class): Heavy implementation
 * - FeimaAuthProvider: Thin VS Code adapter that delegates to this service
 * - FeimaUriEventHandler: Handles OAuth callbacks with multi-request support
 * - OAuth2Service: Stateless OAuth2 protocol implementation (PKCE, token exchange)
 */
export class FeimaAuthenticationService implements IFeimaAuthenticationService {
	readonly _serviceBrand: undefined;

	// Events
	private readonly _onDidChangeSessions = new vscode.EventEmitter<vscode.AuthenticationProviderAuthenticationSessionsChangeEvent>();
	readonly onDidChangeSessions = this._onDidChangeSessions.event;

	// State
	private readonly _secretsKey = 'feimaAuth.tokens';
	private readonly _activeFlows = new Map<string, IActiveFlow>();
	private _cachedSessions: vscode.AuthenticationSession[] = [];
	private readonly _redirectUri: string;
	private readonly _oauth2Service: OAuth2Service;
	private readonly _uriHandler: FeimaUriEventHandler;

	constructor(
		private readonly _context: vscode.ExtensionContext,
		private readonly _logService: ILogService
	) {
		this._oauth2Service = new OAuth2Service();
		this._uriHandler = new FeimaUriEventHandler(_logService);
		
		// Construct redirect URI: vscode://feima.cn-model-for-copilot/oauth/callback
		this._redirectUri = `${vscode.env.uriScheme}://feima.cn-model-for-copilot/oauth/callback`;
		
		this._logService.debug('[FeimaAuthenticationService] Initialized with multi-request support');
		this._logService.debug(`[FeimaAuthenticationService] Redirect URI: ${this._redirectUri}`);
		
		// Load stored sessions on startup
		this._loadStoredSessions();
	}

	// ============ Consumer-Facing Methods ============

	async getToken(): Promise<string | undefined> {
		const sessions = await this.getSessions(undefined, {});
		if (sessions.length === 0) {
			return undefined;
		}
		return sessions[0].accessToken;
	}

	async isAuthenticated(): Promise<boolean> {
		const token = await this.getToken();
		return token !== undefined;
	}

	async refreshToken(): Promise<string | undefined> {
		// Token refresh happens automatically in getSessions()
		return this.getToken();
	}

	async signOut(): Promise<void> {
		const sessions = this._cachedSessions;
		if (sessions.length > 0) {
			await this.removeSession(sessions[0].id);
		}
	}

	// ============ Provider Methods (VS Code AuthenticationProvider interface) ============

	async getSessions(
		_scopes: readonly string[] | undefined,
		_options: vscode.AuthenticationProviderSessionOptions
	): Promise<vscode.AuthenticationSession[]> {
		// CRITICAL FIX: Always validate from storage, not just when cache exists
		const stored = await this._loadStoredToken();
		if (!stored) {
			this._cachedSessions = [];
			return [];
		}

		// Check if token needs refresh (proactive 5-minute check)
		if (this._oauth2Service.shouldRefreshToken(stored.tokenResponse, stored.issuedAt) && stored.tokenResponse.refresh_token) {
			try {
				this._logService.info('Refreshing expired token');
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
				this._logService.error(error as Error, 'Token refresh failed');
				await this._clearStoredToken();
				this._cachedSessions = [];
				return [];
			}
		} else {
			// Token still valid - use cached session
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

		return this._cachedSessions;
	}

	async createSession(
		_scopes: readonly string[],
		_options: vscode.AuthenticationProviderSessionOptions
	): Promise<vscode.AuthenticationSession> {
		this._logService.info('[FeimaAuthenticationService] Starting OAuth2 flow');

		// Build authorization URL (returns nonce and codeVerifier)
		const authData: IAuthorizationUrl = await this._oauth2Service.buildAuthorizationUrl(this._redirectUri);
		const { url: authUrl, nonce, codeVerifier } = authData;

		this._logService.debug(`[FeimaAuthenticationService] Generated OAuth flow: nonce=${nonce}`);

		// Store flow state (allows multiple concurrent flows)
		this._activeFlows.set(nonce, {
			nonce,
			codeVerifier,
			redirectUri: this._redirectUri
		});

		// Register pending callback with URI handler
		const callbackPromise = this._uriHandler.registerPendingCallback(nonce);

		// Open in browser
		const opened = await vscode.env.openExternal(vscode.Uri.parse(authUrl));
		if (!opened) {
			this._activeFlows.delete(nonce);
			this._uriHandler.cancelPendingCallback(nonce);
			throw new Error('Failed to open authentication URL');
		}

		this._logService.info('[FeimaAuthenticationService] Browser opened, waiting for callback...');

		try {
			// Wait for callback (with 5-minute timeout from URI handler)
			const callbackData: ICallbackData = await callbackPromise;
			const { code } = callbackData;

			// Retrieve flow state
			const flowState = this._activeFlows.get(nonce);
			if (!flowState) {
				throw new Error('OAuth flow state lost');
			}

			this._logService.info('[FeimaAuthenticationService] Callback received, exchanging code for token');

			// Exchange code for token (pass codeVerifier and redirectUri)
			const tokenResponse = await this._oauth2Service.exchangeCodeForToken(
				code,
				flowState.codeVerifier,
				flowState.redirectUri
			);

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

			// Fire events
			this._onDidChangeSessions.fire({
				added: [session],
				removed: [],
				changed: []
			});

			this._logService.info('[FeimaAuthenticationService] Session created successfully');
			return session;

		} catch (error) {
			const errorMsg = error instanceof Error ? error.message : String(error);
			this._logService.error(error as Error, `[FeimaAuthenticationService] OAuth2 flow failed: ${errorMsg}`);
			throw error;
		} finally {
			// Always cleanup flow state
			this._activeFlows.delete(nonce);
			this._logService.debug(`[FeimaAuthenticationService] Cleaned up flow state: nonce=${nonce}, remainingFlows=${this._activeFlows.size}`);
		}
	}

	async removeSession(sessionId: string): Promise<void> {
		this._logService.info(`Removing session: ${sessionId}`);

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

		this._logService.info('Session removed');
	}

	getCachedSessions(): vscode.AuthenticationSession[] {
		return this._cachedSessions;
	}

	/**
	 * Handle OAuth callback URI (called by FeimaAuthProvider via UriHandler).
	 * Delegates to FeimaUriEventHandler for multi-request routing.
	 */
	async handleUri(uri: vscode.Uri): Promise<void> {
		this._uriHandler.handleUri(uri);
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
			this._logService.error(error as Error, 'Failed to parse stored token');
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

	/**
	 * Dispose and clean up resources.
	 */
	dispose(): void {
		this._logService.debug('Disposing authentication service');
		this._uriHandler.dispose();
		this._onDidChangeSessions.dispose();
	}
}
