/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *  Adapted from feima-code OAuth2Service - simplified without dependency injection.
 *--------------------------------------------------------------------------------------------*/

import * as crypto from 'crypto';
import fetch from 'node-fetch';
import { FEIMA_CONFIG, OAUTH2_ENDPOINTS } from '../config';

/**
 * OAuth2 token response structure
 */
export interface ITokenResponse {
	access_token: string;
	refresh_token?: string;
	expires_in?: number;
	token_type: string;
	id_token?: string;
}

/**
 * JWT claims structure from ID token
 */
export interface IJWTClaims {
	sub: string;           // User ID
	email?: string;        // User email
	name?: string;         // Display name
	picture?: string;      // Avatar URL
	iss?: string;          // Issuer
	aud?: string;          // Audience
	exp?: number;          // Expiration
	iat?: number;          // Issued at
}

/**
 * OAuth2 flow state for PKCE validation
 */
interface IOAuth2FlowState {
	codeVerifier: string;
	state: string;
	nonce?: string;
	redirectUri: string;
	startedAt: number;
}

/**
 * Simplified OAuth2 service for authorization code flow with PKCE.
 * No dependency injection - uses fixed configuration.
 */
export class OAuth2Service {
	private _currentFlow: IOAuth2FlowState | undefined;

	/**
	 * Build authorization URL for OAuth2 flow
	 */
	async buildAuthorizationUrl(redirectUri: string): Promise<string> {
		// Generate PKCE parameters
		const codeVerifier = this.generateCodeVerifier();
		const codeChallenge = await this.generateCodeChallenge(codeVerifier);

		// Generate state and nonce
		const state = this.generateState();
		const nonce = this.generateNonce();

		// Store flow state
		this._currentFlow = {
			codeVerifier,
			state,
			nonce,
			redirectUri,
			startedAt: Date.now()
		};

		// Build authorization URL
		const authUrl = new URL(OAUTH2_ENDPOINTS.authorizationEndpoint);
		authUrl.searchParams.set('client_id', FEIMA_CONFIG.clientId);
		authUrl.searchParams.set('response_type', 'code');
		authUrl.searchParams.set('redirect_uri', redirectUri);
		authUrl.searchParams.set('state', state);
		authUrl.searchParams.set('code_challenge', codeChallenge);
		authUrl.searchParams.set('code_challenge_method', 'S256');
		authUrl.searchParams.set('scope', FEIMA_CONFIG.scopes.join(' '));
		authUrl.searchParams.set('nonce', nonce);

		console.log('[OAuth2Service] Authorization URL:', authUrl.toString());
		return authUrl.toString();
	}

	/**
	 * Validate callback and extract authorization code
	 */
	validateCallback(query: string): { code: string } | { error: string } {
		const params = new URLSearchParams(query);

		// Check for error
		const error = params.get('error');
		if (error) {
			return { error: params.get('error_description') || error };
		}

		// Extract code and state
		const code = params.get('code');
		const state = params.get('state');

		if (!code || !state) {
			console.error('[OAuth2Service] Missing code or state');
			return { error: 'Missing code or state in callback' };
		}

		// Validate state
		if (!this._currentFlow || this._currentFlow.state !== state) {
			return { error: 'Invalid state - possible CSRF attack' };
		}

		// Check flow expiration (10 minutes)
		if (Date.now() - this._currentFlow.startedAt > 10 * 60 * 1000) {
			return { error: 'Authorization flow expired' };
		}

		return { code };
	}

	/**
	 * Exchange authorization code for access token
	 */
	async exchangeCodeForToken(code: string): Promise<ITokenResponse> {
		if (!this._currentFlow) {
			throw new Error('No active OAuth2 flow');
		}

		const body = new URLSearchParams();
		body.append('grant_type', 'authorization_code');
		body.append('client_id', FEIMA_CONFIG.clientId);
		body.append('code', code);
		body.append('redirect_uri', this._currentFlow.redirectUri);
		body.append('code_verifier', this._currentFlow.codeVerifier);

		const response = await fetch(OAUTH2_ENDPOINTS.tokenEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			},
			body: body.toString()
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Token exchange failed: ${response.status} ${errorText}`);
		}

		const tokenResponse: ITokenResponse = await response.json() as ITokenResponse;
		this._currentFlow = undefined;

		return tokenResponse;
	}

	/**
	 * Refresh access token using refresh token
	 */
	async refreshAccessToken(refreshToken: string): Promise<ITokenResponse> {
		const body = new URLSearchParams();
		body.append('grant_type', 'refresh_token');
		body.append('client_id', FEIMA_CONFIG.clientId);
		body.append('refresh_token', refreshToken);

		const response = await fetch(OAUTH2_ENDPOINTS.tokenEndpoint, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept': 'application/json'
			},
			body: body.toString()
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Token refresh failed: ${response.status} ${errorText}`);
		}

		return await response.json() as ITokenResponse;
	}

	/**
	 * Extract user claims from JWT token
	 */
	getUserInfo(tokenResponse: ITokenResponse): IJWTClaims | null {
		try {
			const token = tokenResponse.id_token || tokenResponse.access_token;
			if (!token) {
				return null;
			}

			// Decode JWT (without verification - server already validated)
			const parts = token.split('.');
			if (parts.length !== 3) {
				return null;
			}

			const payload = parts[1];
			// Add padding if needed for Base64 decoding
			const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
			const decoded = Buffer.from(paddedPayload, 'base64').toString('utf8');
			return JSON.parse(decoded);
		} catch (error) {
			console.error('[OAuth2Service] Failed to parse JWT:', error);
			return null;
		}
	}

	/**
	 * Check if token needs refresh (5 minutes before expiration)
	 */
	shouldRefreshToken(tokenResponse: ITokenResponse, issuedAt: number): boolean {
		if (!tokenResponse.expires_in) {
			return false;
		}

		const expiresAt = issuedAt + (tokenResponse.expires_in * 1000);
		const now = Date.now();
		const timeUntilExpiry = expiresAt - now;
		const fiveMinutes = 5 * 60 * 1000;

		return timeUntilExpiry < fiveMinutes;
	}

	// ============ PKCE Helpers ============

	/**
	 * Generate random code verifier (43-128 characters)
	 */
	private generateCodeVerifier(): string {
		return crypto.randomBytes(32).toString('base64url');
	}

	/**
	 * Generate code challenge from verifier (SHA256)
	 */
	private async generateCodeChallenge(verifier: string): Promise<string> {
		const hash = crypto.createHash('sha256').update(verifier).digest();
		return Buffer.from(hash).toString('base64url');
	}

	/**
	 * Generate random state parameter
	 */
	private generateState(): string {
		return crypto.randomBytes(32).toString('base64url');
	}

	/**
	 * Generate random nonce parameter
	 */
	private generateNonce(): string {
		return crypto.randomBytes(16).toString('base64url');
	}
}
