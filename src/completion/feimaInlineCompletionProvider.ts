/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { CompletionService } from './completionService';
import { FeimaAuthenticationService } from '../platform/authentication/vscode/feimaAuthenticationService';
import { ModelCatalogService } from '../models/modelCatalog';
import { ILogger } from '../platform/log/common/logService';

/**
 * Feima inline completion provider for VS Code
 * 
 * Provides AI-powered code completions using Feima models (DeepSeek, Claude, etc.)
 * Alternative to GitHub Copilot for users with API access issues.
 */
export class FeimaInlineCompletionProvider implements vscode.InlineCompletionItemProvider {
	private readonly completionService: CompletionService;
	private readonly _log: ILogger;
	
	// Minimum time between completion requests (debounce)
	private static readonly DEBOUNCE_MS = 50;
	
	// Cache last completion to avoid redundant requests
	private lastRequestKey: string | undefined;
	private lastCompletions: vscode.InlineCompletionItem[] | undefined;

	constructor(
		authService: FeimaAuthenticationService,
		private readonly modelCatalog: ModelCatalogService,
		log: ILogger
	) {
		this._log = log;
		this.completionService = new CompletionService(authService, log);
		this._log.info('[FeimaInlineCompletionProvider] Provider initialized');
	}

	/**
	 * Provide inline completion items for the given document and position
	 * 
	 * Called by VS Code when:
	 * - User types in editor
	 * - Cursor position changes
	 * - User explicitly requests completion (Ctrl+Space)
	 * 
	 * @param document Text document
	 * @param position Cursor position
	 * @param context Inline completion context
	 * @param token Cancellation token
	 * @returns Inline completion items or undefined
	 */
	async provideInlineCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		context: vscode.InlineCompletionContext,
		token: vscode.CancellationToken
	): Promise<vscode.InlineCompletionItem[] | vscode.InlineCompletionList | undefined> {
		const startTime = Date.now();
		const requestKey = this.makeRequestKey(document, position);

		try {
			this._log.trace('');
			this._log.trace('='.repeat(80));
			this._log.trace(`provideInlineCompletionItems() called`);
			this._log.trace(`  File: ${document.fileName}`);
			this._log.trace(`  Position: ${position.line}:${position.character}`);
			this._log.trace(`  Language: ${document.languageId}`);
			this._log.trace(`  Trigger: ${context.triggerKind === vscode.InlineCompletionTriggerKind.Automatic ? 'Automatic' : 'Invoke'}`);
			this._log.trace(`  Request key: ${requestKey}`);

			// Check cache for identical request
			if (requestKey === this.lastRequestKey && this.lastCompletions) {
				this._log.trace(`  → Cache HIT: Returning cached completions (${this.lastCompletions.length} items)`);
				this._log.trace('='.repeat(80));
				return this.lastCompletions;
			}

			this._log.trace('  → Cache MISS: Fetching new completion');

			// Skip if suggestion widget is visible (don't compete with IntelliSense)
			if (context.selectedCompletionInfo) {
				this._log.trace(`  → Skipped: IntelliSense active`);
				this._log.trace('='.repeat(80));
				return undefined;
			}

			// Check if current line is empty (skip for now, may revisit)
			const currentLine = document.lineAt(position.line);
			if (currentLine.isEmptyOrWhitespace && position.character === 0) {
				this._log.trace(`  → Skipped: Empty line at column 0`);
				this._log.trace('='.repeat(80));
				return undefined;
			}

			// Build completion request
			// Get default completion model from catalog
			const defaultModel = await this.modelCatalog.getDefaultCompletionModel();
			if (!defaultModel) {
				const elapsedMs = Date.now() - startTime;
				this._log.warn(`No completion models available after ${elapsedMs}ms`);
				this._log.trace('='.repeat(80));
				return undefined;
			}
			this._log.trace(`  Using model: ${defaultModel.id} (${defaultModel.name})`);
			
			const request = this.completionService.buildRequest(
				document,
				position,
				defaultModel.id
			);

			this._log.trace(`  Model: ${request.model}`);
			this._log.trace(`  Prompt length: ${request.prompt.length} chars`);
			this._log.trace(`  Suffix length: ${request.suffix?.length ?? 0} chars`);
			this._log.trace('');
			this._log.trace('  → Calling CompletionService.fetchCompletion()...');

			// Fetch completion from feima-api
			const response = await this.completionService.fetchCompletion(request, token);

			const elapsedMs = Date.now() - startTime;
			this._log.trace('');
			this._log.trace(`  ✓ Received ${response.choices.length} choice(s) in ${elapsedMs}ms`);

			// Convert to VS Code inline completion items
			const items: vscode.InlineCompletionItem[] = [];

			for (const choice of response.choices) {
				// Skip empty completions
				if (!choice.text || choice.text.trim().length === 0) {
					continue;
				}

				// Log completion details
				this._log.trace(`  Choice ${choice.index}:`);
				this._log.trace(`    Text: ${JSON.stringify(choice.text.slice(0, 100))}${choice.text.length > 100 ? '...' : ''}`);
				this._log.trace(`    Finish reason: ${choice.finish_reason}`);

				// Create inline completion item
				const item = new vscode.InlineCompletionItem(
					choice.text,
					new vscode.Range(position, position),
				);

				// Add metadata (command to show source)
				item.command = {
					command: 'feima.showCompletionSource',
					title: 'Show Completion Source',
					arguments: [{
						model: response.model ?? request.model,
						latencyMs: elapsedMs,
						promptLength: request.prompt.length,
						completionLength: choice.text.length,
						finishReason: choice.finish_reason
					}]
				};

				items.push(item);
			}

			// Cache result
			this.lastRequestKey = requestKey;
			this.lastCompletions = items;

			this._log.trace(`  → Returning ${items.length} completion(s)`);
			this._log.trace(`  → Cached for future requests at same position`);
			this._log.trace('='.repeat(80));

			return items.length > 0 ? items : undefined;

		} catch (error) {
			const elapsedMs = Date.now() - startTime;

			// Handle cancellation gracefully
			if (error instanceof vscode.CancellationError) {
				this._log.trace(`  ✗ Cancelled after ${elapsedMs}ms`);
				this._log.trace('='.repeat(80));
				return undefined;
			}

			// Log error
			this._log.error(error as Error, `Error after ${elapsedMs}ms`);
			this._log.trace('='.repeat(80));

			return undefined;
		}
	}

	/**
	 * Create cache key for request deduplication
	 * 
	 * @param document Text document
	 * @param position Cursor position
	 * @returns Unique key for request
	 */
	private makeRequestKey(document: vscode.TextDocument, position: vscode.Position): string {
		// Include document URI, position, and version for cache invalidation
		return `${document.uri.toString()}:${position.line}:${position.character}:${document.version}`;
	}

	/**
	 * Clear completion cache (called when document changes)
	 */
	clearCache(): void {
		if (this.lastRequestKey) {
			this._log.trace(`Cache cleared (had ${this.lastCompletions?.length ?? 0} items)`);
		}
		this.lastRequestKey = undefined;
		this.lastCompletions = undefined;
	}
}

/**
 * Metadata for completion command
 */
interface CompletionMetadata {
	model: string;
	latencyMs: number;
	promptLength: number;
	completionLength: number;
	finishReason: string | null;
}

/**
 * Register Feima inline completion provider with VS Code
 * 
 * @param context Extension context
 * @param authService Authentication service
 * @param modelCatalog Model catalog service
 * @param log Logger instance
 * @returns Disposable for cleanup
 */
export function registerInlineCompletionProvider(
	context: vscode.ExtensionContext,
	authService: FeimaAuthenticationService,
	modelCatalog: ModelCatalogService,
	log: ILogger
): vscode.Disposable {
	const provider = new FeimaInlineCompletionProvider(authService, modelCatalog, log);

	// Register for all file types
	// Note: Metadata parameter is proposed API, will be used when available
	const registration = vscode.languages.registerInlineCompletionItemProvider(
		{ pattern: '**' },
		provider
	);

	// Clear cache on document changes
	const documentChangeListener = vscode.workspace.onDidChangeTextDocument(event => {
		// Only clear if content changed (not just cursor movement)
		if (event.contentChanges.length > 0) {
			provider.clearCache();
		}
	});

	// Register command to show completion source
	const showSourceCommand = vscode.commands.registerCommand(
		'feima.showCompletionSource',
		(metadata: CompletionMetadata) => {
			const detail = [
				`Prompt: ${metadata.promptLength} chars`,
				`Completion: ${metadata.completionLength} chars`,
				`Finish: ${metadata.finishReason}`
			].join('\n');
			
			vscode.window.showInformationMessage(
				`Feima Completion: ${metadata.model} (${metadata.latencyMs}ms)`,
				{ modal: false, detail }
			);
		}
	);

	context.subscriptions.push(registration, documentChangeListener, showSourceCommand);

	return vscode.Disposable.from(registration, documentChangeListener, showSourceCommand);
}
