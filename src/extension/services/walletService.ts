/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { FeimaAuthenticationService } from '../platform/authentication/vscode/feimaAuthenticationService';
import { ILogService } from '../platform/log/common/logService';
import { FeimaConfigService } from '../../config/configService';

export interface WalletBalance {
  availableBalance: number;
  paidRequests: number;
  promoRequests: number;
}

/**
 * Fetches the Feima wallet balance on demand and emits an event when the
 * balance is successfully retrieved.  Balance refreshes are triggered either
 * by a purchase-success deep-link callback or by an explicit call to refreshNow().
 *
 * Designed to be created once and registered in context.subscriptions.
 */
export class WalletService implements vscode.Disposable {
  private readonly _onBalanceChanged = new vscode.EventEmitter<WalletBalance>();
  readonly onBalanceChanged = this._onBalanceChanged.event;

  private readonly _authService: FeimaAuthenticationService;
  private readonly _logService: ILogService;

  constructor(authService: FeimaAuthenticationService, logService: ILogService) {
    this._authService = authService;
    this._logService = logService;
  }

  dispose(): void {
    this._onBalanceChanged.dispose();
  }

  /**
   * Fetch the current balance and fire onBalanceChanged if successful.
   * Called by the URI handler when a purchase-success deep link is received.
   */
  async refreshNow(): Promise<void> {
    await this._fetchBalance();
  }

  private async _fetchBalance(): Promise<void> {
    try {
      const session = await vscode.authentication.getSession('feima', [], { createIfNone: false });
      if (!session) {
        return; // Not signed in — skip silently
      }

      const config = FeimaConfigService.getInstance().getConfig();
      const url = `${config.apiBaseUrl}/wallet/balance`;

      const response = await fetch(url, {
        headers: { 'Authorization': `Bearer ${session.accessToken}` },
      });

      if (!response.ok) {
        this._logService.warn(`[WalletService] Balance fetch failed: HTTP ${response.status}`);
        return;
      }

      const data = (await response.json()) as {
        available_balance: number;
        paid_requests: number;
        promo_requests: number;
      };

      const balance: WalletBalance = {
        availableBalance: data.available_balance,
        paidRequests: data.paid_requests,
        promoRequests: data.promo_requests,
      };

      this._logService.info(`[WalletService] Balance fetched: available=${balance.availableBalance}`);
      this._onBalanceChanged.fire(balance);
    } catch (err) {
      this._logService.warn(`[WalletService] Fetch error: ${String(err)}`);
    }
  }
}
