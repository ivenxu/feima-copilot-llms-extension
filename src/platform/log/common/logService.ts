/*---------------------------------------------------------------------------------------------
 *  Licensed under the MIT License.
 *  Adapted from feima-code logging infrastructure.
 *--------------------------------------------------------------------------------------------*/

/**
 * Log levels matching VS Code's LogLevel enum
 */
export enum LogLevel {
	Off = 0,
	Trace = 1,
	Debug = 2,
	Info = 3,
	Warning = 4,
	Error = 5
}

/**
 * Interface for log targets (output channels, console, telemetry, etc.)
 */
export interface ILogTarget {
	logIt(level: LogLevel, message: string): void;
	show?(preserveFocus?: boolean): void;
}

/**
 * Logger interface matching VS Code's LogOutputChannel methods
 */
export interface ILogger {
	trace(message: string): void;
	debug(message: string): void;
	info(message: string): void;
	warn(message: string): void;
	error(error: string | Error, message?: string): void;
	show(preserveFocus?: boolean): void;
	
	/**
	 * Creates a sub-logger with a topic prefix.
	 * All messages will be prefixed with [Topic].
	 */
	createSubLogger(topic: string | readonly string[]): ILogService;
	
	/**
	 * Returns a new logger with an extra target.
	 * Can be chained to add multiple targets.
	 */
	withExtraTarget(target: ILogTarget): ILogService;
}

/**
 * Main log service interface
 */
export interface ILogService extends ILogger {
	// Marker for service identification
	readonly _serviceBrand: undefined;
}

/**
 * Log service implementation
 */
export class LogServiceImpl implements ILogService {
	declare _serviceBrand: undefined;
	
	private readonly _logger: LoggerImpl;
	
	constructor(logTargets: ILogTarget[]) {
		this._logger = new LoggerImpl(logTargets);
	}
	
	trace(message: string): void {
		this._logger.trace(message);
	}
	
	debug(message: string): void {
		this._logger.debug(message);
	}
	
	info(message: string): void {
		this._logger.info(message);
	}
	
	warn(message: string): void {
		this._logger.warn(message);
	}
	
	error(error: string | Error, message?: string): void {
		this._logger.error(error, message);
	}
	
	show(preserveFocus?: boolean): void {
		this._logger.show(preserveFocus);
	}
	
	createSubLogger(topic: string | readonly string[]): ILogService {
		return this._logger.createSubLogger(topic);
	}
	
	withExtraTarget(target: ILogTarget): ILogService {
		return this._logger.withExtraTarget(target);
	}
}

/**
 * Internal logger implementation
 */
class LoggerImpl implements ILogService {
	declare _serviceBrand: undefined;
	
	constructor(private readonly _logTargets: ILogTarget[]) {}
	
	private _logIt(level: LogLevel, message: string): void {
		this._logTargets.forEach(t => t.logIt(level, message));
	}
	
	trace(message: string): void {
		this._logIt(LogLevel.Trace, message);
	}
	
	debug(message: string): void {
		this._logIt(LogLevel.Debug, message);
	}
	
	info(message: string): void {
		this._logIt(LogLevel.Info, message);
	}
	
	warn(message: string): void {
		this._logIt(LogLevel.Warning, message);
	}
	
	error(error: string | Error, message?: string): void {
		const errorMsg = collectErrorMessages(error) + (message ? `: ${message}` : '');
		this._logIt(LogLevel.Error, errorMsg);
	}
	
	show(preserveFocus?: boolean): void {
		this._logTargets.forEach(t => t.show?.(preserveFocus));
	}
	
	createSubLogger(topic: string | readonly string[]): ILogService {
		return new SubLogger(this, topic);
	}
	
	withExtraTarget(target: ILogTarget): ILogService {
		return new LoggerWithExtraTargets(this, [target]);
	}
}

/**
 * Sub-logger with topic prefix
 */
class SubLogger implements ILogService {
	declare _serviceBrand: undefined;
	private readonly _prefix: string;
	
	constructor(
		private readonly _parent: ILogService,
		topic: string | readonly string[],
		existingPrefix?: string
	) {
		const topics = Array.isArray(topic) ? topic : [topic];
		const newPrefix = topics.map(t => `[${t}]`).join('');
		this._prefix = existingPrefix ? existingPrefix + newPrefix : newPrefix;
	}
	
	private _prefixMessage(message: string): string {
		return `${this._prefix} ${message}`;
	}
	
	trace(message: string): void {
		this._parent.trace(this._prefixMessage(message));
	}
	
	debug(message: string): void {
		this._parent.debug(this._prefixMessage(message));
	}
	
	info(message: string): void {
		this._parent.info(this._prefixMessage(message));
	}
	
	warn(message: string): void {
		this._parent.warn(this._prefixMessage(message));
	}
	
	error(error: string | Error, message?: string): void {
		const prefixedMessage = message ? this._prefixMessage(message) : this._prefix;
		this._parent.error(error, prefixedMessage);
	}
	
	show(preserveFocus?: boolean): void {
		this._parent.show(preserveFocus);
	}
	
	createSubLogger(topic: string | readonly string[]): ILogService {
		return new SubLogger(this._parent, topic, this._prefix);
	}
	
	withExtraTarget(target: ILogTarget): ILogService {
		return new LoggerWithExtraTargets(this, [target], this._prefix);
	}
}

/**
 * Logger with extra targets
 */
class LoggerWithExtraTargets implements ILogService {
	declare _serviceBrand: undefined;
	
	constructor(
		private readonly _parent: ILogService,
		private readonly _extraTargets: readonly ILogTarget[],
		private readonly _prefix: string = ''
	) {}
	
	private _notifyExtraTargets(level: LogLevel, message: string): void {
		const prefixedMessage = this._prefix ? `${this._prefix} ${message}` : message;
		for (const target of this._extraTargets) {
			try {
				target.logIt(level, prefixedMessage);
			} catch {
				// Silent catch - extra targets must not affect primary logging
			}
		}
	}
	
	trace(message: string): void {
		this._notifyExtraTargets(LogLevel.Trace, message);
		this._parent.trace(message);
	}
	
	debug(message: string): void {
		this._notifyExtraTargets(LogLevel.Debug, message);
		this._parent.debug(message);
	}
	
	info(message: string): void {
		this._notifyExtraTargets(LogLevel.Info, message);
		this._parent.info(message);
	}
	
	warn(message: string): void {
		this._notifyExtraTargets(LogLevel.Warning, message);
		this._parent.warn(message);
	}
	
	error(error: string | Error, message?: string): void {
		const errorStr = typeof error === 'string' ? error : (error.message || 'Error');
		const fullMessage = message ? `${errorStr}: ${message}` : errorStr;
		this._notifyExtraTargets(LogLevel.Error, fullMessage);
		this._parent.error(error, message);
	}
	
	show(preserveFocus?: boolean): void {
		this._parent.show(preserveFocus);
		for (const target of this._extraTargets) {
			try {
				target.show?.(preserveFocus);
			} catch {
				// Silent catch
			}
		}
	}
	
	createSubLogger(topic: string | readonly string[]): ILogService {
		const topics = Array.isArray(topic) ? topic : [topic];
		const newPrefix = this._prefix + topics.map(t => `[${t}]`).join('');
		return new LoggerWithExtraTargets(
			this._parent.createSubLogger(topic),
			this._extraTargets,
			newPrefix
		);
	}
	
	withExtraTarget(target: ILogTarget): ILogService {
		return new LoggerWithExtraTargets(
			this._parent,
			[...this._extraTargets, target],
			this._prefix
		);
	}
}

/**
 * Collect error messages from nested errors
 * Using 'any' type for error objects as they can have various shapes
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function collectErrorMessages(e: any): string {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const seen = new Set<any>();
	
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function collect(e: any, indent: string): string {
		if (!e || !['object', 'string'].includes(typeof e) || seen.has(e)) {
			return '';
		}
		seen.add(e);
		
		const message = typeof e === 'string' ? e : (e.stack || e.message || e.code || e.toString?.() || '');
		const messageStr = message.toString?.() as (string | undefined) || '';
		
		return [
			messageStr ? `${messageStr.split('\n').map(line => `${indent}${line}`).join('\n')}\n` : '',
			collect(e.cause, indent + '  '),
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			...(Array.isArray(e.errors) ? e.errors.map((e: any) => collect(e, indent + '  ')) : []),
		].join('');
	}
	
	return collect(e, '').trim();
}
