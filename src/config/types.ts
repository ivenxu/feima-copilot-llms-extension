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
	 * Display name shown in VS Code Marketplace and GUI
	 * - CN: "飞码扣"
	 * - Global: "Feima Code Models"
	 */
	displayName: string;

	/**
	 * Short description for marketplace
	 */
	description: string;

	/**
	 * Icon file path relative to workspace root
	 * Used by marketplace and extensions view
	 */
	icon: string;

	/**
	 * Default language code for this region
	 * - CN: 'zh-CN'
	 * - Global: 'en-US'
	 */
	language: string;

	/**
	 * Default OAuth2 authorization endpoint URL (region-specific)
	 * Can be overridden by VS Code setting: feima.auth.baseUrl
	 * - CN default: https://auth.feima.ai/cn
	 * - Global default: https://auth.feima.ai/global
	 */
	defaultAuthEndpoint: string;

	/**
	 * Default Model API endpoint URL (region-specific)
	 * Can be overridden by VS Code setting: feima.api.baseUrl
	 * - CN default: https://api.feima.ai/cn
	 * - Global default: https://api.feima.ai
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
}
