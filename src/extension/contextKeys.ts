/*---------------------------------------------------------------------------------------------
 *  Feima Extension Context Keys
 *  Central definition of all VS Code context keys used by the extension.
 *  Context keys drive `when` clause expressions in package.json contributions.
 *--------------------------------------------------------------------------------------------*/

/**
 * Set to `true` while the user is signed in to Feima.
 * Drives the sign-in / sign-out menu item visibility.
 */
export const FEIMA_AUTH_SIGNED_IN_KEY = 'github.copilot.feimaAuth.signedIn';

/**
 * Set to `true` when the last request failed due to insufficient balance (HTTP 402).
 * Can be used by status-bar contributions to show a low-credit icon.
 * Reset to `false` on a successful request.
 */
export const FEIMA_INSUFFICIENT_BALANCE_KEY = 'feima.insufficientBalance';
