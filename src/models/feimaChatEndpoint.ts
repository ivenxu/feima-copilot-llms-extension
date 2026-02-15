/*---------------------------------------------------------------------------------------------
 *  Feima Chat Endpoint
 *  Handles endpoint configuration, auth, and request body creation.
 *  Pattern adapted from feima-code/src/platform/endpoint/node/feimaChatEndpoint.ts
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ILogService } from '../platform/log/common/logService';
import { FeimaAuthenticationService } from '../platform/authentication/vscode/feimaAuthenticationService';
import { countTokens } from '../platform/tokenizer/tikTokenizer';
import { FEIMA_CONFIG } from '../config';

/**
 * Callback invoked as stream progresses with deltas.
 * Pattern from feima-code FinishedCallback.
 */
export type FinishedCallback = (fullText: string, delta: StreamDelta) => Promise<number | undefined>;

/**
 * Delta from streaming response.
 * Pattern from feima-code IResponseDelta.
 */
export interface StreamDelta {
	text?: string;
	toolCalls?: Array<{
		id: string;
		name: string;
		arguments: string;
	}>;
}

/**
 * Chat response result.
 * Simplified from feima-code ChatResponse.
 */
export type ChatResponse =
	| { type: 'success'; requestId?: string }
	| { type: 'error'; reason: string; requestId?: string };

/**
 * Model information from catalog
 */
/**
 * Chat completion request body for OpenAI-compatible API
 */
export interface ChatCompletionRequest {
	model: string;
	messages: Array<{
		role: 'user' | 'assistant' | 'system' | 'tool';
		content?: string | null;
		tool_call_id?: string;
		tool_calls?: Array<{
			id: string;
			type: 'function';
			function: { name: string; arguments: string };
		}>;
	}>;
	stream: boolean;
	temperature?: number;
	max_tokens?: number;
	tools?: Array<{
		type: 'function';
		function: {
			name: string;
			description: string;
			parameters?: object;
		};
	}>;
	tool_choice?: { type: 'function'; function: { name: string } };
}

/**
 * Minimal interface for LanguageModelToolResultPart 
 * (actual type from VS Code API)
 */
interface ToolResultPart {
	callId: string;
	content: string | vscode.LanguageModelTextPart[];
}

/**
 * Minimal interface for LanguageModelToolCallPart
 * (actual type from VS Code API)
 */
interface ToolCallPart {
	callId: string;
	name: string;
	input: object;
}

export interface ModelInfo {
	id: string;
	name: string;
	family: string;
	maxInputTokens: number;
	maxOutputTokens: number;
	supportsToolCalls: boolean;
	supportsVision: boolean;
}

/**
 * Feima Chat Endpoint
 * 
 * Handles:
 * - Model metadata and capabilities
 * - Authentication token management
 * - Request body creation
 * - Request headers
 */
export class FeimaChatEndpoint {
	private _cachedToken: string | null = null;

	constructor(
		private readonly modelInfo: ModelInfo,
		private readonly authService: FeimaAuthenticationService,
		private readonly log: ILogService
	) {
		// Pre-fetch token on construction
		this._prefetchToken();
	}

	/**
	 * Get model ID
	 */
	get model(): string {
		return this.modelInfo.id;
	}

	/**
	 * Get model name
	 */
	get name(): string {
		return this.modelInfo.name;
	}

	/**
	 * Get model family
	 */
	get family(): string {
		return this.modelInfo.family;
	}

	/**
	 * Get max input tokens
	 */
	get maxInputTokens(): number {
		return this.modelInfo.maxInputTokens;
	}

	/**
	 * Get max output tokens
	 */
	get maxOutputTokens(): number {
		return this.modelInfo.maxOutputTokens;
	}

	/**
	 * Check if model supports tool calls
	 */
	get supportsToolCalls(): boolean {
		return this.modelInfo.supportsToolCalls;
	}

	/**
	 * Check if model supports vision
	 */
	get supportsVision(): boolean {
		return this.modelInfo.supportsVision;
	}

	/**
	 * Get API endpoint URL
	 */
	get apiUrl(): string {
		return `${FEIMA_CONFIG.apiBaseUrl}/v1/chat/completions`;
	}

	/**
	 * Pre-fetch and cache token to avoid latency on first request
	 */
	private async _prefetchToken(): Promise<void> {
		try {
			const sessions = await this.authService.getSessions(undefined, {});
			const session = sessions[0];
			if (session) {
				this._cachedToken = session.accessToken;
			}
		} catch (error) {
			this.log.error(error as Error, '[FeimaChatEndpoint] Failed to prefetch token');
		}
	}

	/**
	 * Get fresh auth token (refreshes if needed)
	 */
	async getAuthToken(): Promise<string> {
		try {
			const sessions = await this.authService.getSessions(undefined, {});
			const session = sessions[0];
			if (!session) {
				throw new Error('Not authenticated');
			}
			this._cachedToken = session.accessToken;
			return session.accessToken;
		} catch (error) {
			this.log.error(error as Error, '[FeimaChatEndpoint] Failed to get auth token');
			throw error;
		}
	}

	/**
	 * Get request headers including auth
	 */
	async getHeaders(): Promise<Record<string, string>> {
		const token = await this.getAuthToken();
		return {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`
		};
	}

	/**
	 * Create request body for chat completion
	 */
	createRequestBody(
		messages: vscode.LanguageModelChatMessage[],
		options: {
			tools?: readonly vscode.LanguageModelChatTool[];
			toolMode?: vscode.LanguageModelChatToolMode;
		}
	): ChatCompletionRequest {
		// Convert VS Code messages to API format
		// Need to handle tool calls and tool results properly
		const requestMessages: ChatCompletionRequest['messages'] = [];

		for (const msg of messages) {
			// Check if this is a User message with tool results
			const hasToolResults = Array.isArray(msg.content) && 
				msg.content.some(part => 
					typeof part === 'object' && 'callId' in part && 'content' in part
				);

			if (hasToolResults && msg.role === vscode.LanguageModelChatMessageRole.User) {
				// Convert tool results to role="tool" messages
				const toolResultParts = (Array.isArray(msg.content) ? msg.content : [msg.content])
					.filter(part => typeof part === 'object' && 'callId' in part && 'content' in part);

				this.log.debug(`[FeimaChatEndpoint] Converting ${toolResultParts.length} tool results to role="tool" messages`);

				for (const part of toolResultParts) {
					const toolResultPart = part as ToolResultPart;
					const resultContent = Array.isArray(toolResultPart.content)
						? toolResultPart.content.map((c: vscode.LanguageModelTextPart | string) => 
							c instanceof vscode.LanguageModelTextPart ? c.value : String(c)
						).join('')
						: String(toolResultPart.content || '');
					
					this.log.debug(`[FeimaChatEndpoint] Tool result for callId=${toolResultPart.callId}, content length: ${resultContent.length}`);
					
					requestMessages.push({
						role: 'tool',
						tool_call_id: toolResultPart.callId,
						content: resultContent
					});
				}
			} else if (msg.role === vscode.LanguageModelChatMessageRole.Assistant) {
				// Check if assistant message has tool calls
				const toolCallParts = (Array.isArray(msg.content) ? msg.content : [msg.content])
					.filter(part => typeof part === 'object' && 'callId' in part && 'name' in part && 'input' in part);

				// Extract text content
				const textContent = (Array.isArray(msg.content) ? msg.content : [msg.content])
					.map(part => {
						if (part instanceof vscode.LanguageModelTextPart) {
							return part.value;
						}
						return '';
					})
					.join('');

				const assistantMsg: ChatCompletionRequest['messages'][0] = {
					role: 'assistant',
					content: textContent || null
				};

				// Add tool calls if present
				if (toolCallParts.length > 0) {
					this.log.debug(`[FeimaChatEndpoint] Assistant message with ${toolCallParts.length} tool calls`);
					assistantMsg.tool_calls = toolCallParts.map((part: unknown) => {
						const toolCallPart = part as ToolCallPart;
						this.log.debug(`[FeimaChatEndpoint] Tool call: ${toolCallPart.name} (callId: ${toolCallPart.callId})`);
						return {
							id: toolCallPart.callId,
							type: 'function' as const,
							function: {
								name: toolCallPart.name,
								arguments: JSON.stringify(toolCallPart.input || {})
							}
						};
					});
				}

				requestMessages.push(assistantMsg);
			} else {
				// Regular user/system message
				const content = typeof msg.content === 'string' ? msg.content :
					msg.content.map(part => {
						if (part instanceof vscode.LanguageModelTextPart) {
							return part.value;
						}
						return '';
					}).join('');

				requestMessages.push({
					role: msg.role === vscode.LanguageModelChatMessageRole.User ? 'user' as const :
						msg.role === vscode.LanguageModelChatMessageRole.Assistant ? 'assistant' as const :
						'system' as const,
					content
				});
			}
		}

		const requestBody: ChatCompletionRequest = {
			model: this.model,
			messages: requestMessages,
			stream: true,
			temperature: 0.7,
			max_tokens: this.maxOutputTokens
		};

		// Add tools if provided and supported
		if (options.tools && options.tools.length > 0 && this.supportsToolCalls) {
			requestBody.tools = options.tools.map(tool => ({
				type: 'function',
				function: {
					name: tool.name,
					description: tool.description,
					// Only include parameters if inputSchema has keys (pattern from feima-code)
					// Empty objects can confuse models or trigger API errors
					parameters: tool.inputSchema && Object.keys(tool.inputSchema).length > 0
						? tool.inputSchema
						: undefined
				}
			}));

			// Set tool_choice based on toolMode
			// Only set when Required mode AND exactly 1 tool (match feima-code behavior)
			if (options.toolMode === vscode.LanguageModelChatToolMode.Required && options.tools.length === 1) {
				requestBody.tool_choice = {
					type: 'function',
					function: { name: options.tools[0].name }
				};
			}
			// Otherwise defaults to "auto" (let model decide)
		}

		return requestBody;
	}

	/**
	 * Validate request before sending
	 */
	validateRequest(
		messages: vscode.LanguageModelChatMessage[],
		options: {
			tools?: readonly vscode.LanguageModelChatTool[];
			toolMode?: vscode.LanguageModelChatToolMode;
		}
	): void {
		// Must have at least one message
		if (!messages || messages.length === 0) {
			throw new Error('Invalid request: no messages.');
		}

		// Validate tool configuration
		if (options.tools) {
			// Check tool names
			for (const tool of options.tools) {
				if (!tool.name.match(/^[\w-]+$/)) {
					throw new Error(`Invalid tool name "${tool.name}": only alphanumeric characters, hyphens, and underscores are allowed.`);
				}
			}

			// Check tool count
			if (options.tools.length > 128) {
				throw new Error('Cannot have more than 128 tools per request.');
			}

			// Validate toolMode (match feima-code behavior)
			if (options.toolMode === vscode.LanguageModelChatToolMode.Required && options.tools.length > 1) {
				throw new Error('LanguageModelChatToolMode.Required is not supported with more than one tool');
			}

			// Warn if tools provided but not supported
			if (!this.supportsToolCalls) {
				this.log.warn(`[FeimaChatEndpoint] Tools provided but model ${this.model} does not support tool calls`);
			}
		}

		// Validate tool call/result pairing in message history
		messages.forEach((message, i) => {
			if (message.role === vscode.LanguageModelChatMessageRole.Assistant) {
				const content = Array.isArray(message.content) ? message.content : [message.content];
				const toolCallParts = content.filter(part => 
					typeof part === 'object' && 'callId' in part && 'name' in part
				);

				if (toolCallParts.length > 0) {
					const nextMessage = messages.at(i + 1);
					if (!nextMessage || nextMessage.role !== vscode.LanguageModelChatMessageRole.User) {
						throw new Error('Tool call must be followed by User message with tool results');
					}
				}
			}
		});
	}

	/**
	 * Provide token count for message
	 */
	async provideTokenCount(text: string | vscode.LanguageModelChatMessage): Promise<number> {
		const textContent = typeof text === 'string' 
			? text 
			: (typeof text.content === 'string' 
				? text.content 
				: text.content.map(part => {
					if (part instanceof vscode.LanguageModelTextPart) {
						return part.value;
					}
					return '';
				}).join(''));

		const tokenCount = countTokens(this.model, textContent);
		this.log.debug(`[FeimaChatEndpoint] provideTokenCount: model=${this.model}, textLength=${textContent.length}, tokenCount=${tokenCount}`);
		return tokenCount;
	}

	/**
	 * Make chat completion request with streaming.
	 * Pattern from feima-code CopilotChatEndpoint.makeChatRequest.
	 * 
	 * @param messages Chat messages
	 * @param callback Callback for streaming deltas
	 * @param token Cancellation token
	 * @param tools Optional tools to provide
	 * @param toolMode Optional tool mode
	 * @returns Chat response result
	 */
	async makeChatRequest(
		messages: vscode.LanguageModelChatMessage[],
		callback: FinishedCallback,
		token: vscode.CancellationToken,
		tools?: readonly vscode.LanguageModelChatTool[],
		toolMode?: vscode.LanguageModelChatToolMode
	): Promise<ChatResponse> {
		// Validate request
		this.validateRequest(messages, { tools, toolMode });

		// Get auth token
		const authToken = await this.getAuthToken();
		if (!authToken) {
			return { type: 'error', reason: 'Authentication failed: no token available' };
		}

		// Create request body
		const requestBody = this.createRequestBody(messages, { tools, toolMode });

		try {
			// Get headers (need to await since it's async)
			const baseHeaders = await this.getHeaders();
			
			// Make HTTP request
			const response = await fetch(this.apiUrl, {
				method: 'POST',
				headers: {
					...baseHeaders,
					'Authorization': `Bearer ${authToken}`,
				},
				body: JSON.stringify(requestBody),
			});

			if (!response.ok) {
				const errorText = await response.text();
				this.log.error(`[FeimaChatEndpoint] Request failed: HTTP ${response.status}: ${errorText}`);
				return { type: 'error', reason: `HTTP ${response.status}: ${errorText}` };
			}

			if (!response.body) {
				return { type: 'error', reason: 'No response body received' };
			}

			// Parse SSE stream
			await this._parseSSEStream(response.body, callback, token);

			return { type: 'success' };

		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error);
			this.log.error(`[FeimaChatEndpoint] Request error: ${reason}`);
			return { type: 'error', reason };
		}
	}

	/**
	 * Parse SSE stream from response body.
	 * Pattern from feima-code CopilotLanguageModelWrapper._parseSSEStream.
	 */
	private async _parseSSEStream(
		body: ReadableStream<Uint8Array>,
		callback: FinishedCallback,
		token: vscode.CancellationToken
	): Promise<void> {
		const reader = body.getReader();
		const decoder = new TextDecoder('utf-8');
		let buffer = '';
		let fullText = '';
		const toolCallsMap = new Map<number, { id: string; name: string; arguments: string }>();
		const emittedToolCallIds = new Set<string>(); // Track emitted tool call IDs to prevent duplicates

		try {
			let done = false;
			while (!done && !token.isCancellationRequested) {
				const result = await reader.read();
				done = result.done;
				
				if (done || !result.value) {
					break;
				}
				
				const value = result.value;

				// Decode chunk and add to buffer
				buffer += decoder.decode(value, { stream: true });

				// Process complete lines
				const lines = buffer.split('\n');
				buffer = lines.pop() || ''; // Keep last incomplete line in buffer

				for (const line of lines) {
					if (!line.trim() || line.startsWith(':')) {
						continue; // Skip empty lines and comments
					}

					if (line.startsWith('data: ')) {
						const data = line.slice(6).trim();

						if (data === '[DONE]') {
							// Emit accumulated tool calls when stream is done
							if (toolCallsMap.size > 0) {
								const completedCalls = Array.from(toolCallsMap.values()).filter(
									call => call.id && call.name && !emittedToolCallIds.has(call.id)
								);
								if (completedCalls.length > 0) {
									this.log.debug(`[FeimaChatEndpoint] Emitting ${completedCalls.length} tool calls at [DONE]`);
									// Mark as emitted
									completedCalls.forEach(call => emittedToolCallIds.add(call.id));
									await callback(fullText, { toolCalls: completedCalls });
									toolCallsMap.clear(); // Clear after emitting to prevent duplicate
								}
							}
							continue;
						}

						try {
							const parsed = JSON.parse(data);
							const choice = parsed.choices?.[0];
							if (!choice) {
								continue;
							}

							const delta = choice.delta;
							const streamDelta: StreamDelta = {};

							// Handle text content - emit immediately for streaming
							if (delta.content) {
								fullText += delta.content;
								streamDelta.text = delta.content;
							}

							// Accumulate tool calls silently (don't emit on every chunk)
							if (delta.tool_calls && Array.isArray(delta.tool_calls)) {
								for (const toolCall of delta.tool_calls) {
									const index = toolCall.index ?? 0;
									const existing = toolCallsMap.get(index);

									if (existing) {
										// Accumulate arguments
										if (toolCall.function?.arguments) {
											existing.arguments += toolCall.function.arguments;
										}
									} else {
										// New tool call
										toolCallsMap.set(index, {
											id: toolCall.id || '',
											name: toolCall.function?.name || '',
											arguments: toolCall.function?.arguments || '',
										});
									}
								}
								// NOTE: Don't include toolCalls in streamDelta here!
								// We'll emit them only when [DONE] or finish_reason indicates completion
							}

							// Check for finish_reason - indicates this choice is complete
							if (choice.finish_reason && toolCallsMap.size > 0) {
								// Emit tool calls when finish_reason present (skip already emitted)
								const completedCalls = Array.from(toolCallsMap.values()).filter(
									call => call.id && call.name && !emittedToolCallIds.has(call.id)
								);
								if (completedCalls.length > 0) {
								this.log.debug(`[FeimaChatEndpoint] Emitting ${completedCalls.length} tool calls at finish_reason: ${choice.finish_reason}`);
									// Mark as emitted
									completedCalls.forEach(call => emittedToolCallIds.add(call.id));
									streamDelta.toolCalls = completedCalls;
									// Clear map after emitting to prevent duplicate
									toolCallsMap.clear();
								}
							}

							// Invoke callback with delta (text only, or text + completed tool calls)
							if (streamDelta.text || streamDelta.toolCalls) {
								await callback(fullText, streamDelta);
							}

						} catch (e) {
							const errorMsg = e instanceof Error ? e.message : String(e);
							this.log.error(`[FeimaChatEndpoint] Failed to parse SSE data: ${errorMsg}. Data: ${data}`);
						}
					}
				}
			}

			// Safety: emit any remaining tool calls if stream ended without [DONE]
			if (toolCallsMap.size > 0) {
				const completedCalls = Array.from(toolCallsMap.values()).filter(
					call => call.id && call.name && !emittedToolCallIds.has(call.id)
				);
				if (completedCalls.length > 0) {
					this.log.debug(`[FeimaChatEndpoint] Emitting ${completedCalls.length} tool calls at stream end`);
					// Mark as emitted
					completedCalls.forEach(call => emittedToolCallIds.add(call.id));
					await callback(fullText, { toolCalls: completedCalls });
				}
			}
		} finally {
			reader.releaseLock();
		}
	}
}
