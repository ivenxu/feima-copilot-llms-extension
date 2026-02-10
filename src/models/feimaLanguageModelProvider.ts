/**
 * Feima Language Model Provider for VS Code
 * 
 * Implements vscode.LanguageModelChatProvider to expose Chinese LLM models
 * (DeepSeek, Qwen, etc.) to GitHub Copilot Chat through feima-api.
 */

import * as vscode from 'vscode';
import fetch from 'node-fetch';
import { FEIMA_CONFIG } from '../config';
import { FeimaAuthProvider } from '../auth/feimaAuthProvider';

/**
 * Model information from feima-api (/v1/models endpoint)
 * Matches IModelAPIResponse structure from feima-api spec
 */
interface ModelInfo {
	// Core identification
	id: string;
	name: string;
	version: string;
	object: string;
	vendor?: string;
	
	// Model picker configuration
	model_picker_enabled: boolean;
	model_picker_category?: string; // 'lightweight', 'versatile', 'powerful'
	preview?: boolean;
	is_chat_default?: boolean;
	is_chat_fallback?: boolean;
	
	// Nested capabilities object
	capabilities: {
		type: 'chat' | 'completion' | 'embeddings';
		family: string;
		tokenizer?: string;
		object?: string;
		limits: {
			max_prompt_tokens: number;
			max_output_tokens: number;
			max_context_window_tokens?: number;
		};
		supports: {
			streaming: boolean;
			tool_calls?: boolean;
			parallel_tool_calls?: boolean;
			vision?: boolean;
			structured_outputs?: boolean;
		};
	};
	
	// Policy and billing
	policy?: {
		state: 'enabled' | 'disabled' | 'unconfigured';
		terms?: string;
	};
	billing?: {
		is_premium: boolean;
		multiplier: number;
		restricted_to?: string[];
	};
	
	// Optional fields
	supported_endpoints?: string[];
	warning_messages?: Array<{ code: string; message: string }>;
	info_messages?: Array<{ code: string; message: string }>;
	custom_model?: { key_name?: string; owner_name?: string };
	
	// Other fields
	created?: number;
	owned_by?: string;
	enabled?: boolean;
}

/**
 * Chat message format (OpenAI-compatible)
 */
interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

/**
 * Chat completion request body
 */
interface ChatCompletionRequest {
	model: string;
	messages: ChatMessage[];
	temperature?: number;
	max_tokens?: number;
	stream: boolean;
	top_p?: number;
	n?: number;
	stop?: string[];
}

/**
 * Chat completion response (non-streaming)
 */
interface _ChatCompletionResponse {
	id: string;
	object: string;
	created: number;
	model: string;
	choices: Array<{
		index: number;
		message: {
			role: string;
			content: string;
		};
		finish_reason: string;
	}>;
	usage: {
		prompt_tokens: number;
		completion_tokens: number;
		total_tokens: number;
	};
}

/**
 * Feima Language Model Provider
 * 
 * Integrates Chinese LLM models into VS Code's Language Model API,
 * allowing them to be used in GitHub Copilot Chat alongside GitHub's models.
 */
export class FeimaLanguageModelProvider implements vscode.LanguageModelChatProvider {
	private readonly _onDidChange = new vscode.EventEmitter<void>();
	readonly onDidChangeLanguageModelChatInformation = this._onDidChange.event;

	private _modelCache: vscode.LanguageModelChatInformation[] = [];
	private _lastFetchTime = 0;
	private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

	constructor(
		private readonly authProvider: FeimaAuthProvider,
		private readonly outputChannel: vscode.OutputChannel
	) {
		this.log('=== FeimaLanguageModelProvider constructor called ===');
		this.log(`Output channel: ${outputChannel.name}`);
		
		// Listen to auth changes to refresh model list
		authProvider.onDidChangeSessions(() => {
			this.log('🔄 Auth session changed, firing onDidChange event to refresh models');
			this._onDidChange.fire();
		});
		
		this.log('✅ FeimaLanguageModelProvider initialized successfully');
	}

	/**
	 * Provide available Feima models to VS Code
	 * 
	 * Fetches model catalog from feima-api and transforms into
	 * vscode.LanguageModelChatInformation format.
	 */
	async provideLanguageModelChatInformation(
		_options: { silent: boolean },
		token: vscode.CancellationToken
	): Promise<vscode.LanguageModelChatInformation[]> {
		this.log('=================================================');
		this.log('🎯 provideLanguageModelChatInformation called');
		this.log(`   Options: silent=${_options.silent}`);
		this.log(`   Token: cancelled=${token.isCancellationRequested}`);
		this.log('=================================================');
		
		try {
			// Check authentication
			this.log('📝 Step 1: Checking authentication...');
			const sessions = await this.authProvider.getSessions([]);
			this.log(`   Found ${sessions.length} auth sessions`);
			
			if (sessions.length > 0) {
				const session = sessions[0];
				this.log(`   Session ID: ${session.id}`);
				this.log(`   Account: ${session.account.label}`);
				this.log(`   Access token length: ${session.accessToken.length}`);
				this.log(`   Access token prefix: ${session.accessToken.substring(0, 20)}...`);
			}
			
			if (sessions.length === 0) {
				this.log('❌ No auth session, returning empty model list');
				return [];
			}

			// Use cached models if still valid
			this.log('📝 Step 2: Checking cache...');
			const now = Date.now();
			const cacheAge = now - this._lastFetchTime;
			this.log(`   Cache size: ${this._modelCache.length} models`);
			this.log(`   Cache age: ${Math.floor(cacheAge / 1000)}s (TTL: ${this.CACHE_TTL / 1000}s)`);
			
			if (this._modelCache.length > 0 && cacheAge < this.CACHE_TTL) {
				this.log(`✅ Using cached models (${this._modelCache.length} models)`);
				return this._modelCache;
			}
			this.log('   Cache expired or empty, fetching fresh data...');

			// Fetch models from feima-api
			this.log('📝 Step 3: Fetching models from API...');
			const accessToken = sessions[0].accessToken;
			const models = await this.fetchModels(accessToken, token);
			this.log(`   ✅ Fetched ${models.length} models from API`);
			
			if (models.length > 0) {
				this.log(`   First model raw: ${JSON.stringify(models[0], null, 2)}`);
			}

			// Transform to VS Code format
			this.log('📝 Step 4: Transforming to VS Code format...');
			
			// Filter models that are enabled for model picker
			const pickerModels = models.filter(model => model.model_picker_enabled);
			this.log(`   Filtered to ${pickerModels.length} picker-enabled models (from ${models.length} total)`);
			
			const vsCodeModels: vscode.LanguageModelChatInformation[] = pickerModels.map(model => {
				// Build tooltip from policy terms or version
				const tooltip = model.policy?.terms || `${model.vendor || 'Feima'} ${model.version}`;
				
				// Build detail string (multiplier or "Free")
				const detail = model.billing?.multiplier && model.billing.multiplier > 0
					? `${model.billing.multiplier}x`
					: 'Free';
				
				return {
					id: model.id, // Use model ID directly, NO "feima/" prefix
					name: model.name,
					family: model.capabilities.family,
					version: model.version,
					tooltip: tooltip,
					detail: detail,
					maxInputTokens: model.capabilities.limits.max_prompt_tokens,
					maxOutputTokens: model.capabilities.limits.max_output_tokens,
					// CRITICAL: isUserSelectable makes models visible by default in picker (proposed API)
					isUserSelectable: true,
					capabilities: {
						imageInput: model.capabilities.supports.vision || false,
						toolCalling: model.capabilities.supports.tool_calls || false
					}
				};
			});
			this.log(`   ✅ Transformed to ${vsCodeModels.length} VS Code models`);
			this.log(`   First transformed model:`);
			if (vsCodeModels.length > 0) {
				this.log(`   ${JSON.stringify(vsCodeModels[0], null, 2)}`);
			}

			// Update cache
			this.log('📝 Step 5: Updating cache...');
			this._modelCache = vsCodeModels;
			this._lastFetchTime = now;
			this.log('   ✅ Cache updated');

			this.log('=================================================');
			this.log(`🎉 Returning ${vsCodeModels.length} models to VS Code`);


			return this._modelCache;
		} catch (error) {
			this.log('=================================================');
			this.logError('❌ Failed to fetch models', error);
			// Return cached models as fallback
			this.log(`⚠️  Returning ${this._modelCache.length} cached models as fallback`);
			this.log('=================================================');
			return this._modelCache;
		}
	}

	/**
	 * Provide chat response by proxying to feima-api
	 * 
	 * Transforms VS Code chat messages to OpenAI format, sends to feima-api,
	 * and streams the response back through the progress reporter.
	 */
	async provideLanguageModelChatResponse(
		model: vscode.LanguageModelChatInformation,
		messages: vscode.LanguageModelChatMessage[],
		options: vscode.ProvideLanguageModelChatResponseOptions,
		progress: vscode.Progress<vscode.LanguageModelResponsePart>,
		token: vscode.CancellationToken
	): Promise<void> {
		try {
			// Extract model ID (no prefix to remove, use as-is)
			const modelId = model.id;
			this.log(`Chat request for model: ${modelId}`);

			// Get access token
			const sessions = await this.authProvider.getSessions([]);
			if (sessions.length === 0) {
				throw new Error('Not authenticated. Please sign in to Feima.');
			}
			const accessToken = sessions[0].accessToken;

			// Transform VS Code messages to OpenAI format
			const chatMessages: ChatMessage[] = messages.map(msg => ({
				role: msg.role === vscode.LanguageModelChatMessageRole.User ? 'user' : 'assistant',
				content: typeof msg.content === 'string' ? msg.content : 
					msg.content.map(part => {
						if (typeof part === 'string') { return part; }
						if (part instanceof vscode.LanguageModelTextPart) { return part.value; }
						return ''; // Other part types
					}).join('')
			}));

			// Build request
			const request: ChatCompletionRequest = {
				model: modelId,
				messages: chatMessages,
				temperature: 0.7,
				stream: true, // Always stream for better UX
				...options.modelOptions
			};

			// Send request and stream response
			await this.streamChatCompletion(request, accessToken, progress, token);

		} catch (error) {
			this.logError('Chat request failed', error);
			throw error;
		}
	}

	/**
	 * Provide token count for rate limiting
	 * 
	 * Simple estimation: 1 token ≈ 4 characters for English, 1 token ≈ 1.5-2 characters for Chinese
	 */
	async provideTokenCount(
		_model: vscode.LanguageModelChatInformation,
		text: string | vscode.LanguageModelChatMessage,
		_token: vscode.CancellationToken
	): Promise<number> {
		// Extract text content
		let content: string;
		if (typeof text === 'string') {
			content = text;
		} else {
			content = typeof text.content === 'string' ? text.content :
				text.content.map(part => {
					if (typeof part === 'string') { return part; }
					if (part instanceof vscode.LanguageModelTextPart) { return part.value; }
					return ''; // Other part types
				}).join('');
		}

		// Simple heuristic: count Chinese and English characters separately
		const chineseChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
		const otherChars = content.length - chineseChars;

		// Estimate tokens: Chinese ~1.5 chars/token, English ~4 chars/token
		const chineseTokens = Math.ceil(chineseChars / 1.5);
		const otherTokens = Math.ceil(otherChars / 4);

		return chineseTokens + otherTokens;
	}

	/**
	 * Fetch models from feima-api
	 */
	private async fetchModels(
		accessToken: string,
		token: vscode.CancellationToken
	): Promise<ModelInfo[]> {
		const url = `${FEIMA_CONFIG.apiBaseUrl}/v1/models`;
		this.log(`🌐 Fetching models from: ${url}`);
		this.log(`   Using access token: ${accessToken.substring(0, 20)}...`);

		const abortController = new AbortController();
		token.onCancellationRequested(() => {
			this.log('❌ Fetch cancelled by token');
			abortController.abort();
		});

		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			signal: abortController.signal
		});

		this.log(`   Response status: ${response.status} ${response.statusText}`);
		this.log(`   Response headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()))}`);
		
		if (!response.ok) {
			const errorText = await response.text();
			this.log(`   Error response body: ${errorText}`);
			throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
		}

		const responseText = await response.text();
		this.log(`   Response body length: ${responseText.length} chars`);
		this.log(`   Response body preview: ${responseText.substring(0, 500)}...`);
		
		const data = JSON.parse(responseText) as { object: string; data: ModelInfo[] };
		this.log(`   Parsed data.object: ${data.object}`);
		this.log(`   Parsed data.data length: ${data.data?.length || 0}`);
		return data.data || [];
	}

	/**
	 * Stream chat completion from feima-api
	 */
	private async streamChatCompletion(
		request: ChatCompletionRequest,
		accessToken: string,
		progress: vscode.Progress<vscode.LanguageModelResponsePart>,
		token: vscode.CancellationToken
	): Promise<void> {
		const url = `${FEIMA_CONFIG.apiBaseUrl}/v1/chat/completions`;
		this.log(`Streaming chat completion to: ${url}`);

		const abortController = new AbortController();
		token.onCancellationRequested(() => abortController.abort());

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(request),
			signal: abortController.signal
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Chat request failed: ${response.status} ${errorText}`);
		}

		// Parse SSE stream
		if (!response.body) {
			throw new Error('No response body');
		}

		const reader = response.body;
		let buffer = '';

		for await (const chunk of reader) {
			if (token.isCancellationRequested) {
				break;
			}

			buffer += chunk.toString();
			const lines = buffer.split('\n');
			buffer = lines.pop() || '';

			for (const line of lines) {
				if (!line.trim() || !line.startsWith('data: ')) {
					continue;
				}

				const data = line.slice(6); // Remove 'data: ' prefix
				if (data === '[DONE]') {
					return;
				}

				try {
					const parsed = JSON.parse(data);
					const delta = parsed.choices?.[0]?.delta;
					if (delta?.content) {
						progress.report(new vscode.LanguageModelTextPart(delta.content));
					}
				} catch (parseError) {
					this.logError('Failed to parse SSE chunk', parseError);
				}
			}
		}
	}

	/**
	 * Log message to output channel
	 */
	private log(message: string): void {
		const timestamp = new Date().toISOString();
		this.outputChannel.appendLine(`[${timestamp}] [FeimaModelProvider] ${message}`);
	}

	/**
	 * Log error to output channel
	 */
	private logError(message: string, error: unknown): void {
		const timestamp = new Date().toISOString();
		const errorMessage = error instanceof Error ? error.message : String(error);
		this.outputChannel.appendLine(`[${timestamp}] [FeimaModelProvider] ERROR: ${message} - ${errorMessage}`);
		if (error instanceof Error && error.stack) {
			this.outputChannel.appendLine(error.stack);
		}
	}

	/**
	 * Dispose resources
	 */
	dispose(): void {
		this._onDidChange.dispose();
	}
}
