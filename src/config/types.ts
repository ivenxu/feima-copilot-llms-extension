/**
 * Region Configuration Types
 * Defines the structure for region-specific metadata and defaults.
 * 
 * NOTE: Dynamic configuration (auth endpoints, API endpoints) is managed
 * through VS Code settings (feima.auth.baseUrl, feima.api.baseUrl, etc.)
 * with region-specific defaults as fallbacks.
 */

export type RegionType = 'cn' | 'global';

export interface RegionConfig {
	/**
	 * Region identifier
	 * - 'cn': China mainland
	 * - 'global': US, EU, and international
	 */
	region: RegionType;

	/**
	 * VS Code Marketplace extension ID
	 */
	extensionId: string;

	/**
	 * Marketplace publisher name
	 */
	publisher: string;

	/**
	 * Default OAuth2 authorization endpoint URL (region-specific)
	 * Can be overridden by VS Code setting: feima.auth.baseUrl
	 * - CN default: https://auth.feimacode.cn
	 * - Global default: https://auth.feimacode.com
	 */
	defaultAuthEndpoint: string;

	/**
	 * Default Model API endpoint URL (region-specific)
	 * Can be overridden by VS Code setting: feima.api.baseUrl
	 * - CN default: https://api.feimacode.cn/v1
	 * - Global default: https://api.feimacode.com/v1
	 */
	defaultApiEndpoint: string;

	/**
	 * Default OAuth2 client ID
	 * Can be overridden by VS Code setting: feima.auth.clientId
	 */
	defaultClientId: string;

	/**
	 * Default OAuth2 issuer URL
	 * Can be overridden by VS Code setting: feima.auth.issuer
	 */
	defaultIssuer: string;

	/**
	 * OAuth2 scopes (same for all regions)
	 */
	scopes: string[];

	/**
	 * Marketplace URL for the extension
	 */
	marketplaceUrl: string;

	/**
	 * GitHub repository URL for the extension
	 */
	repositoryUrl: string;

	/**
	 * URL for the promotions / credits page.
	 * Shown to users when they run out of credits (HTTP 402).
	 * Points to the public-preview earning page; will be updated to a
	 * purchase page once the product is generally available.
	 */
	promotionUrl: string;

	/**
	 * Base URL for the Feima website.
	 * Used to compose links to the profile page, activity logs, etc.
	 * - CN default: https://feimacode.cn
	 * - Global default: https://feimacode.com
	 */
	websiteBaseUrl: string;

	/**
	 * When true, a system message instructing the model to always respond in
	 * English is prepended to every request. Should be `true` for the global
	 * market and `false` for the CN market.
	 */
	enforceEnglish: boolean;
}
