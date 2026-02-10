/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

/**
 * Feima configuration - production endpoints.
 * These are fixed for the supplement extension (no DI needed).
 */
export const FEIMA_CONFIG = {
	/** OAuth2 identity provider */
	authBaseUrl: 'http://106.14.75.37/dev/auth',
	
	/** Model API gateway */
	apiBaseUrl: 'http://106.14.75.37/dev/api',
	
	/** OAuth2 client ID (shared with feima-code extension) */
	clientId: 'vscode-feima-client',
	
	/** OAuth2 issuer */
	issuer: 'http://auth.feima.ai',
	
	/** OAuth2 scopes */
	scopes: ['openid', 'profile', 'email'],
} as const;

/**
 * OAuth2 endpoints derived from configuration
 */
export const OAUTH2_ENDPOINTS = {
	authorizationEndpoint: `${FEIMA_CONFIG.authBaseUrl}/oauth/authorize`,
	tokenEndpoint: `${FEIMA_CONFIG.authBaseUrl}/oauth/token`,
	revocationEndpoint: `${FEIMA_CONFIG.authBaseUrl}/oauth/revoke`,
	userinfoEndpoint: `${FEIMA_CONFIG.authBaseUrl}/oauth/userinfo`,
} as const;
