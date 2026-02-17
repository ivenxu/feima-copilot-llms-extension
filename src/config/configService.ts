/**
 * Configuration Service with VS Code Settings Integration
 * 
 * This service merges VS Code settings with region defaults to provide
 * runtime-configurable endpoints while maintaining region-specific defaults.
 * 
 * Priority order:
 * 1. VS Code settings (user/workspace customization)
 * 2. Region defaults (fallback for not-configured settings)
 * 3. Hardcoded defaults (final fallback)
 */

import * as vscode from 'vscode';
import { activeRegionConfig } from './regions';

/**
 * Resolved configuration with VS Code settings merged over region defaults
 */
export interface ResolvedConfig {
	/**
	 * OAuth2 authentication service base URL
	 * Can be overridden by feima.auth.baseUrl VS Code setting
	 */
	authBaseUrl: string;

	/**
	 * Model inference API server base URL
	 * Can be overridden by feima.api.baseUrl VS Code setting
	 */
	apiBaseUrl: string;

	/**
	 * OAuth2 client ID for authentication
	 * Can be overridden by feima.auth.clientId VS Code setting
	 */
	clientId: string;

	/**
	 * OAuth2 issuer URL
	 * Can be overridden by feima.auth.issuer VS Code setting
	 */
	issuer: string;

	/**
	 * OAuth2 scopes for token request
	 * Always from region config (cannot be overridden)
	 */
	scopes: string[];
}

/**
 * Configuration service for reading and caching configuration
 */
export class FeimaConfigService implements vscode.Disposable {
	private static instance: FeimaConfigService;
	private configurationChangeDisposable: vscode.Disposable | undefined;
	private cachedConfig: ResolvedConfig | undefined;

	private constructor() {
		// Listen for configuration changes to invalidate cache
		this.configurationChangeDisposable = vscode.workspace.onDidChangeConfiguration(
			(e) => {
				if (
					e.affectsConfiguration('feima.auth.baseUrl') ||
					e.affectsConfiguration('feima.api.baseUrl') ||
					e.affectsConfiguration('feima.auth.clientId') ||
					e.affectsConfiguration('feima.auth.issuer')
				) {
					// Invalidate cache on relevant setting changes
					this.cachedConfig = undefined;
				}
			}
		);
	}

	/**
	 * Get singleton instance of configuration service
	 */
	static getInstance(): FeimaConfigService {
		if (!FeimaConfigService.instance) {
			FeimaConfigService.instance = new FeimaConfigService();
		}
		return FeimaConfigService.instance;
	}

	/**
	 * Get resolved configuration with VS Code settings merged over region defaults
	 */
	getConfig(): ResolvedConfig {
		// Return cached config if available
		if (this.cachedConfig) {
			return this.cachedConfig;
		}

		const config = vscode.workspace.getConfiguration('feima');

		// Get auth base URL: setting > default
		const authBaseUrl = config.get<string>('auth.baseUrl') || activeRegionConfig.defaultAuthEndpoint;

		// Get API base URL: setting > default
		const apiBaseUrl = config.get<string>('api.baseUrl') || activeRegionConfig.defaultApiEndpoint;

		// Get client ID: setting > default
		const clientId = config.get<string>('auth.clientId') || activeRegionConfig.defaultClientId;

		// Get issuer: setting > default
		const issuer = config.get<string>('auth.issuer') || activeRegionConfig.defaultIssuer;

		// Scopes always from region config
		const scopes = activeRegionConfig.scopes;

		this.cachedConfig = {
			authBaseUrl,
			apiBaseUrl,
			clientId,
			issuer,
			scopes,
		};

		return this.cachedConfig;
	}

	/**
	 * Get OAuth2 endpoints derived from configuration
	 */
	getOAuth2Endpoints() {
		const config = this.getConfig();
		return {
			authorizationEndpoint: `${config.authBaseUrl}/oauth/authorize`,
			tokenEndpoint: `${config.authBaseUrl}/oauth/token`,
			revocationEndpoint: `${config.authBaseUrl}/oauth/revoke`,
			userinfoEndpoint: `${config.authBaseUrl}/oauth/userinfo`,
		} as const;
	}

	/**
	 * Get OAuth2 client configuration
	 */
	getOAuthClientConfig() {
		const config = this.getConfig();
		return {
			clientId: config.clientId,
			issuer: config.issuer,
			scopes: config.scopes,
		} as const;
	}

	/**
	 * Cleanup resources
	 */
	dispose(): void {
		this.configurationChangeDisposable?.dispose();
	}
}

/**
 * Convenience function to get configuration service instance
 */
export function getConfigService(): FeimaConfigService {
	return FeimaConfigService.getInstance();
}

/**
 * Convenience function to get resolved configuration
 */
export function getResolvedConfig(): ResolvedConfig {
	return getConfigService().getConfig();
}
