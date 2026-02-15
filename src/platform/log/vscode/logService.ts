/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *  VS Code-specific log service implementation using LogOutputChannel.
 *--------------------------------------------------------------------------------------------*/

import * as vscode from 'vscode';
import { ILogTarget, LogLevel } from '../common/logService';

/**
 * Log target that writes to VS Code's LogOutputChannel
 */
export class VSCodeLogTarget implements ILogTarget {
	constructor(private readonly _channel: vscode.LogOutputChannel) {}
	
	logIt(level: LogLevel, message: string): void {
		switch (level) {
			case LogLevel.Trace:
				this._channel.trace(message);
				break;
			case LogLevel.Debug:
				this._channel.debug(message);
				break;
			case LogLevel.Info:
				this._channel.info(message);
				break;
			case LogLevel.Warning:
				this._channel.warn(message);
				break;
			case LogLevel.Error:
				this._channel.error(message);
				break;
		}
	}
	
	show(preserveFocus?: boolean): void {
		this._channel.show(preserveFocus);
	}
}

/**
 * Console log target for debug output
 */
export class ConsoleLogTarget implements ILogTarget {
	constructor(
		private readonly prefix?: string,
		private readonly minLogLevel: LogLevel = LogLevel.Warning
	) {}
	
	logIt(level: LogLevel, message: string): void {
		const prefixedMessage = this.prefix ? `${this.prefix}${message}` : message;
		
		// Only log warnings and errors to console
		if (level === LogLevel.Error) {
			console.error(prefixedMessage);
		} else if (level === LogLevel.Warning) {
			console.warn(prefixedMessage);
		} else if (level >= this.minLogLevel) {
			console.log(prefixedMessage);
		}
	}
}
