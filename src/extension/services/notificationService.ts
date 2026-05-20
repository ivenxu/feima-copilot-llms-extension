/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { FeimaConfigService } from '../../config/configService';
import { WalletBalance } from './walletService';

/**
 * Shows a VS Code information message when new credits have been added to the
 * user's wallet (e.g. after a successful Lemon Squeezy purchase).
 */
export function showCreditsAdded(balance: WalletBalance): void {
  const total = balance.availableBalance.toLocaleString();
  vscode.window.showInformationMessage(
    vscode.l10n.t('Credits added! Your new balance is {0} requests.', total),
    vscode.l10n.t('View Profile')
  ).then(action => {
    if (action === vscode.l10n.t('View Profile')) {
      const config = FeimaConfigService.getInstance().getConfig();
      void vscode.env.openExternal(
        vscode.Uri.parse(`${config.websiteBaseUrl}/profile`)
      );
    }
  });
}
