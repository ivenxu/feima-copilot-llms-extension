/*---------------------------------------------------------------------------------------------
 *  Feima Language Model Wrapper
 *  Handles VS Code language model API integration and streaming.
 *  Pattern adapted from feima-code/src/extension/conversation/vscode-node/languageModelAccess.ts
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ILogService } from '../platform/log/common/logService';
import { FeimaChatEndpoint, FinishedCallback, StreamDelta } from './feimaChatEndpoint';

/**
 * Wrapper class that handles VS Code language model API integration.
 * Delegates endpoint concerns to FeimaChatEndpoint.
 * 
 * Pattern adapted from feima-code CopilotLanguageModelWrapper.
 */
export class FeimaLanguageModelWrapper {
	constructor(
		private readonly log: ILogService
	) {}

	/**
	 * Provide language model response with proper tool call handling.
	 * Pattern from feima-code: call endpoint.makeChatRequest with callback.
	 */
	async provideLanguageModelResponse(
		endpoint: FeimaChatEndpoint,
		messages: vscode.LanguageModelChatMessage[],
		options: {
			tools?: readonly vscode.LanguageModelChatTool[];
			toolMode?: vscode.LanguageModelChatToolMode;
		},
		progress: vscode.Progress<vscode.LanguageModelTextPart | vscode.LanguageModelToolCallPart>,
		token: vscode.CancellationToken
	): Promise<void> {
		this.log.info(`[Wrapper] provideLanguageModelResponse called for model: ${endpoint.model}`);
		this.log.debug(`[Wrapper] Options - tools: ${options.tools?.length ?? 0}, toolMode: ${options.toolMode}`);

		// Track reported tool call IDs to detect duplicates
		const reportedToolCallIds = new Set<string>();

		// Create callback that converts deltas to VS Code progress reports
		const finishCallback: FinishedCallback = async (_fullText: string, delta: StreamDelta): Promise<undefined> => {
			// Report text content
			if (delta.text) {
				progress.report(new vscode.LanguageModelTextPart(delta.text));
			}

			// Report tool calls
			if (delta.toolCalls) {
				this.log.debug(`[Wrapper] Emitting ${delta.toolCalls.length} tool calls`);
				for (const call of delta.toolCalls) {
					try {
						// Validate tool call structure
						if (!call.id || !call.name) {
							this.log.error(`[Wrapper] Invalid tool call structure - missing id or name. Call: ${JSON.stringify(call)}`);
							continue;
						}

						// Check for duplicate tool call ID
						if (reportedToolCallIds.has(call.id)) {
							this.log.error(`[Wrapper] ⚠️  DUPLICATE TOOL CALL DETECTED! Already reported ${call.name} (${call.id})`);
							continue; // Skip duplicates
						}

						const argsStr = call.arguments || '{}';
						this.log.debug(`[Wrapper] Tool call ${call.name} (${call.id}) arguments length: ${argsStr.length}`);

						// Validate JSON before parsing
						const trimmedArgs = argsStr.trim();
						if (!trimmedArgs.startsWith('{') && !trimmedArgs.startsWith('[')) {
							this.log.error(`[Wrapper] Tool call ${call.name} has invalid JSON format (doesn't start with { or [): ${argsStr.substring(0, 100)}`);
							progress.report(new vscode.LanguageModelToolCallPart(call.id, call.name, {}));
							reportedToolCallIds.add(call.id); // Track even fallback reports
							continue;
						}

						// Parse accumulated arguments
						const parameters = JSON.parse(argsStr);
						
						// Validate parsed result is an object
						if (typeof parameters !== 'object' || parameters === null) {
							this.log.error(`[Wrapper] Tool call ${call.name} parsed to non-object: ${typeof parameters}`);
							progress.report(new vscode.LanguageModelToolCallPart(call.id, call.name, {}));
							reportedToolCallIds.add(call.id); // Track even fallback reports
							continue;
						}

						progress.report(new vscode.LanguageModelToolCallPart(call.id, call.name, parameters));
						reportedToolCallIds.add(call.id); // Track as reported
						this.log.debug(`[Wrapper] Successfully emitted tool call: ${call.name} (id: ${call.id})`);
					} catch (err) {
						// Enhanced error logging with more context
						const errorDetail = err instanceof Error ? err.message : String(err);
						const argsPreview = call.arguments ? call.arguments.substring(0, 200) : '<empty>';
						this.log.error(
							`[Wrapper] Failed to parse tool call JSON for ${call.name} (${call.id}). ` +
							`Error: ${errorDetail}. Arguments preview: ${argsPreview}` +
							(call.arguments && call.arguments.length > 200 ? `... (${call.arguments.length} total chars)` : '')
						);
						// Report with empty parameters as fallback
						const callId = call.id || 'unknown';
						if (callId !== 'unknown') {
							reportedToolCallIds.add(callId); // Track fallback reports
						}
						progress.report(new vscode.LanguageModelToolCallPart(callId, call.name || 'unknown', {}));
					}
				}
			}

			return undefined;
		};

		// Delegate to endpoint (pattern from feima-code)
		const result = await endpoint.makeChatRequest(
			messages,
			finishCallback,
			token,
			options.tools,
			options.toolMode
		);

		// Handle error result
		if (result.type === 'error') {
			this.log.error(`[Wrapper] Chat request failed: ${result.reason}`);
			throw new Error(result.reason);
		}

		this.log.debug('[Wrapper] Chat request completed successfully');
	}

	/**
	 * Provide token count for message.
	 * Delegates to endpoint.
	 */
	async provideTokenCount(
		endpoint: FeimaChatEndpoint,
		text: string | vscode.LanguageModelChatMessage
	): Promise<number> {
		return endpoint.provideTokenCount(text);
	}
}
