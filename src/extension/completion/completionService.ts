/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { FeimaAuthenticationService } from '../platform/authentication/vscode/feimaAuthenticationService';
import { getResolvedConfig } from '../../config/configService';
import { ILogger } from '../platform/log/common/logService';

/**
 * OpenAI-compatible completion request for feima-api /v1/completions endpoint
 */
export interface CompletionRequest {
	/** Model ID to use (e.g., "deepseek-coder", "claude-3-5-sonnet") */
	model: string;
	/** Document text before cursor */
	prompt: string;
	/** Document text after cursor (for fill-in-the-middle) */
	suffix?: string;
	/** Maximum tokens to generate */
	max_tokens: number;
	/** Sampling temperature (0-2) */
	temperature: number;
	/** Nucleus sampling parameter (0-1) */
	top_p: number;
	/** Number of completions to generate */
	n: number;
	/** Stop sequences */
	stop: string[];
	/** Always true for streaming */
	stream: true;
	/** Programming language for context */
	language?: string;
}

/**
 * Single completion choice from SSE stream
 */
export interface CompletionChoice {
	/** Choice index */
	index: number;
	/** Generated text (accumulated from SSE chunks) */
	text: string;
	/** Reason for completion finishing */
	finish_reason: 'stop' | 'length' | 'content_filter' | null;
}

/**
 * Completion response from feima-api
 */
export interface CompletionResponse {
	/** Array of completion choices */
	choices: CompletionChoice[];
	/** Model used for generation */
	model?: string;
	/** Usage statistics (optional) */
	usage?: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

/**
 * Service for fetching inline completions from feima-api
 */
export class CompletionService {
	private static readonly REQUEST_TIMEOUT_MS = 5000; // 5 seconds
	private readonly _log: ILogger;

	constructor(
		private readonly authService: FeimaAuthenticationService,
		log: ILogger
	) {
		this._log = log;
	}

	/**
	 * Fetch inline completion from feima-api /v1/completions endpoint
	 * 
	 * @param request Completion request parameters
	 * @param token Cancellation token
	 * @returns Completion response with streaming chunks aggregated
	 */
	async fetchCompletion(
		request: CompletionRequest,
		token: vscode.CancellationToken
	): Promise<CompletionResponse> {
		this._log.trace('fetchCompletion() called');
		this._log.trace(`  Model: ${request.model}`);
		this._log.trace(`  Prompt length: ${request.prompt.length} chars`);
		this._log.trace(`  Suffix length: ${request.suffix?.length ?? 0} chars`);
		this._log.trace(`  Max tokens: ${request.max_tokens}`);
		this._log.trace(`  Temperature: ${request.temperature}`);

		// Get JWT token
		const accessToken = await this.authService.getToken();
		if (!accessToken) {
			this._log.error('Not authenticated');
			throw new Error('Not authenticated with Feima');
		}

		// Build request URL using resolved config (settings override region defaults)
		const apiBase = getResolvedConfig().apiBaseUrl || '';
		const url = `${apiBase}/completions`;
		this._log.trace(`POST ${url}`);

		// Create AbortController for timeout and cancellation
		const abortController = new AbortController();
		const timeoutId = setTimeout(() => abortController.abort(), CompletionService.REQUEST_TIMEOUT_MS);

		// Listen for VS Code cancellation
		token.onCancellationRequested(() => abortController.abort());

		try {
			// Make HTTP POST request
			const response = await fetch(url, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${accessToken}`,
					'Content-Type': 'application/json',
					'User-Agent': 'cn-model-for-copilot/0.0.1',
				},
				body: JSON.stringify(request),
				signal: abortController.signal
			});

			clearTimeout(timeoutId);

			this._log.trace(`Response status: ${response.status} ${response.statusText}`);

			if (!response.ok) {
				this._log.error(`HTTP ${response.status}`);
				throw new Error(`Feima API error: ${response.status} ${response.statusText}`);
			}

			if (!response.body) {
				this._log.error('No response body');
				throw new Error('No response body from Feima API');
			}

			this._log.trace('Parsing SSE stream...');
			// Parse SSE stream
			const completionResponse = await this.parseSSEStream(response.body, token);

			this._log.trace(`Success: Received ${completionResponse.choices.length} choice(s)`);
			return completionResponse;

		} catch (error) {
			clearTimeout(timeoutId);

			// Handle aborted requests
			if (error instanceof Error && error.name === 'AbortError') {
				if (token.isCancellationRequested) {
					this._log.trace('Request cancelled by user');
					throw new vscode.CancellationError();
				}
				this._log.error('Request timeout');
				throw new Error('Request timeout');
			}

			this._log.error(error as Error, 'Request failed');
			throw error;
		}
	}

	/**
	 * Parse Server-Sent Events (SSE) stream from feima-api
	 * 
	 * Format:
	 * ```
	 * data: {"choices":[{"index":0,"text":"code","finish_reason":null}]}
	 * data: {"choices":[{"index":0,"text":" snippet","finish_reason":null}]}
	 * data: {"choices":[{"index":0,"text":"","finish_reason":"stop"}]}
	 * data: [DONE]
	 * ```
	 * 
	 * @param body Response body stream
	 * @param token Cancellation token
	 * @returns Aggregated completion response
	 */
	private async parseSSEStream(
		body: ReadableStream<Uint8Array>,
		token: vscode.CancellationToken
	): Promise<CompletionResponse> {
		const reader = body.getReader();
		const decoder = new TextDecoder();
		
		let buffer = '';
		const choices: Map<number, { text: string; finish_reason: string | null }> = new Map();
		let model: string | undefined;
		let usage: CompletionResponse['usage'] | undefined;
		let chunkCount = 0;

		try {
			let done = false;
			while (!done) {
				// Check cancellation
				if (token.isCancellationRequested) {
					reader.cancel();
					throw new vscode.CancellationError();
				}

				// Read next chunk
				const readResult = await reader.read();
				
				if (readResult.done) {
					done = true;
					break;
				}

				// Decode chunk and add to buffer
				buffer += decoder.decode(readResult.value, { stream: true });
				chunkCount++;

				// Process complete lines (separated by \n)
				const lines = buffer.split('\n');
				buffer = lines.pop() || ''; // Keep incomplete line in buffer

				for (const line of lines) {
					const trimmed = line.trim();
					
					// Skip empty lines
					if (!trimmed) {
						continue;
					}

					// Parse SSE data line
					if (!trimmed.startsWith('data: ')) {
						continue;
					}

					const dataContent = trimmed.slice('data: '.length);

					// Check for [DONE] marker
					if (dataContent === '[DONE]') {
						this._log.trace(`Stream finished ([DONE] marker), ${chunkCount} chunks received`);
						// Stream finished
						const result: CompletionResponse = {
							choices: Array.from(choices.entries())
								.map(([index, choice]) => ({
									index,
									text: choice.text,
									finish_reason: (choice.finish_reason || null) as CompletionChoice['finish_reason']
								}))
								.sort((a, b) => a.index - b.index),
							model,
							usage
						};
						return result;
					}

					// Parse JSON data
					try {
						const json = JSON.parse(dataContent);

						// Extract model if present
						if (json.model) {
							model = json.model;
						}

						// Extract usage if present
						if (json.usage) {
							usage = json.usage;
						}

						// Process choices
						if (json.choices && Array.isArray(json.choices)) {
							for (const choice of json.choices) {
								const index = choice.index ?? 0;
								
								// Get or create choice accumulator
								if (!choices.has(index)) {
									choices.set(index, { text: '', finish_reason: null });
								}
								
								const accumulator = choices.get(index)!;
								
								// Accumulate text
								if (choice.text) {
									accumulator.text += choice.text;
								}
								
								// Accumulate delta content (chat streaming format)
								if (choice.delta?.content) {
									accumulator.text += choice.delta.content;
								}
								
								// Update finish reason
								if (choice.finish_reason) {
									accumulator.finish_reason = choice.finish_reason;
								}
							}
						}
					} catch (parseError) {
						console.error('Failed to parse SSE data:', dataContent, parseError);
						// Continue processing other lines
					}
				}
			}

			// Stream ended without [DONE] marker
			// Return accumulated choices
			return {
				choices: Array.from(choices.entries())
					.map(([index, choice]) => ({
						index,
						text: choice.text,
						finish_reason: (choice.finish_reason || null) as CompletionChoice['finish_reason']
					}))
					.sort((a, b) => a.index - b.index),
				model,
				usage
			};

		} finally {
			reader.releaseLock();
		}
	}

	/**
	 * Build completion request from VS Code document context
	 * 
	 * @param document Text document
	 * @param position Cursor position
	 * @param modelId Model to use for completion
	 * @returns Completion request
	 */
	buildRequest(
		document: vscode.TextDocument,
		position: vscode.Position,
		modelId: string
	): CompletionRequest {
		// Get text before and after cursor
		const beforeCursor = document.getText(new vscode.Range(
			new vscode.Position(Math.max(0, position.line - 50), 0), // 50 lines before
			position
		));

		const afterCursor = document.getText(new vscode.Range(
			position,
			new vscode.Position(Math.min(document.lineCount - 1, position.line + 10), Number.MAX_SAFE_INTEGER) // 10 lines after
		));

		return {
			model: modelId,
			prompt: beforeCursor,
			suffix: afterCursor || undefined,
			max_tokens: 500, // Match feima-code default
			temperature: 0.2, // Low temperature for code completion
			top_p: 1.0,
			n: 1, // Single completion for now
			stop: ['\n\n', '```', '###'], // Common code stop sequences
			stream: true,
			language: document.languageId
		};
	}
}
