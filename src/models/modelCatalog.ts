/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { FEIMA_CONFIG } from '../config';

/**
 * Model information from feima-api
 */
export interface FeimaModel {
	id: string;
	name: string;
	family: string;
	version?: string;
	maxInputTokens: number;
	maxOutputTokens: number;
	description?: string;
	vendor: string;
}

/**
 * Model catalog service - fetches available models from feima-api
 */
export class ModelCatalogService {
	private _models: FeimaModel[] = [];
	private _lastFetch: number = 0;
	private readonly _cacheDuration = 5 * 60 * 1000; // 5 minutes

	constructor(
		private readonly _outputChannel: vscode.OutputChannel
	) {}

	/**
	 * Get available models (with caching)
	 */
	async getModels(accessToken: string): Promise<FeimaModel[]> {
		const now = Date.now();
		if (this._models.length > 0 && now - this._lastFetch < this._cacheDuration) {
			return this._models;
		}

		try {
			this._outputChannel.appendLine('[ModelCatalog] Fetching models from feima-api');
			
			const response = await fetch(`${FEIMA_CONFIG.apiBaseUrl}/v1/models`, {
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json'
				}
			});

			if (!response.ok) {
				throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
			}

			const data = await response.json() as { models: FeimaModel[] };
			this._models = data.models;
			this._lastFetch = now;

			this._outputChannel.appendLine(`[ModelCatalog] Fetched ${this._models.length} models`);
			return this._models;
		} catch (error) {
			this._outputChannel.appendLine(`[ModelCatalog] Error fetching models: ${error}`);
			throw error;
		}
	}

	/**
	 * Clear cached models
	 */
	clearCache(): void {
		this._models = [];
		this._lastFetch = 0;
	}

	/**
	 * Convert Feima model to VS Code LanguageModelChatInformation
	 */
	toVSCodeModel(model: FeimaModel): vscode.LanguageModelChatInformation {
		return {
			id: model.id,
			name: model.name,
			family: model.family,
			version: model.version || '',
			maxInputTokens: model.maxInputTokens,
			maxOutputTokens: model.maxOutputTokens,
			capabilities: {
				// Future: add imageInput, toolCalling from model properties
			},
			// Tooltip with model description
			...(model.description && { tooltip: model.description })
		};
	}
}
