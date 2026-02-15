/*---------------------------------------------------------------------------------------------
 *  Token Counter Service
 *  Uses js-tiktoken for accurate token counting across different model encodings
 *--------------------------------------------------------------------------------------------*/

import { encodingForModel } from 'js-tiktoken';
import type { Encoding } from 'js-tiktoken';

/**
 * Maps model families to their encoding names
 */
const MODEL_ENCODING_MAP: Record<string, string> = {
	'gpt-4o': 'o200k_base',
	'gpt-4-turbo': 'cl100k_base',
	'gpt-4': 'cl100k_base',
	'gpt-3.5-turbo': 'cl100k_base',
	'claude-3': 'o200k_base',
	'deepseek': 'cl100k_base',
	// Chinese models - use cl100k as default BPE
	'qwen': 'cl100k_base',
};

/**
 * Token counter using js-tiktoken
 * 
 * Supports accurate token counting for:
 * - GPT-4, GPT-4o
 * - Claude models
 * - DeepSeek and other Chinese models
 */
export class TikTokenizer {
	private _encoding: Encoding | null = null;
	private _modelName: string;

	/**
	 * Create a new tokenizer for the given model
	 * 
	 * @param modelName Model identifier (e.g., 'gpt-4o', 'claude-3-sonnet')
	 */
	constructor(modelName: string) {
		this._modelName = modelName;
		this._initializeEncoding();
	}

	/**
	 * Initialize the encoding for the model
	 */
	private _initializeEncoding(): void {
		try {
			// Try to get encoding directly by model name
			this._encoding = encodingForModel(this._modelName as any);
		} catch {
			// Fallback: extract model family and use known mapping
			const modelFamily = this._modelName.split('-')[0].toLowerCase();
			const encodingName = MODEL_ENCODING_MAP[modelFamily] || 'cl100k_base';

			try {
				// Map encoding name to available encodings
				const validEncodingName = encodingName === 'o200k_base' ? 'gpt-4o' : 'gpt-4';
				this._encoding = encodingForModel(validEncodingName);
			} catch (e) {
				// Final fallback: use GPT-4 encoding
				this._encoding = encodingForModel('gpt-4');
			}
		}
	}

	/**
	 * Count tokens in a text string
	 * 
	 * @param text Text to tokenize
	 * @returns Number of tokens
	 */
	countTokens(text: string): number {
		if (!this._encoding) {
			throw new Error('Encoding not initialized');
		}
		return this._encoding.encode(text).length;
	}

	/**
	 * Encode text to tokens
	 * 
	 * @param text Text to encode
	 * @returns Array of token IDs
	 */
	encode(text: string): number[] {
		if (!this._encoding) {
			throw new Error('Encoding not initialized');
		}
		return this._encoding.encode(text);
	}

	/**
	 * Decode tokens back to text
	 * 
	 * @param tokens Token IDs to decode
	 * @returns Decoded text
	 */
	decode(tokens: number[]): string {
		if (!this._encoding) {
			throw new Error('Encoding not initialized');
		}
		return this._encoding.decode(tokens);
	}
}

/**
 * Global tokenizer instances (cached per model)
 */
const tokenizers = new Map<string, TikTokenizer>();

/**
 * Get or create a tokenizer for the given model
 * 
 * @param modelName Model identifier
 * @returns Tokenizer instance
 */
export function getTokenizer(modelName: string): TikTokenizer {
	if (!tokenizers.has(modelName)) {
		tokenizers.set(modelName, new TikTokenizer(modelName));
	}
	return tokenizers.get(modelName)!;
}

/**
 * Count tokens in text for a specific model
 * 
 * @param modelName Model identifier
 * @param text Text to count tokens for
 * @returns Number of tokens
 */
export function countTokens(modelName: string, text: string): number {
	try {
		return getTokenizer(modelName).countTokens(text);
	} catch (error) {
		// Fallback to character-based estimation if tokenization fails
		return Math.ceil(text.length / 4);
	}
}
