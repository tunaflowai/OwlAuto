export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Minimal structured logger. In production, swap for pino/winston via DI.
 */
export class Logger {
  constructor(private readonly scope: string) {}

  private emit(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    const entry = {
      ts: new Date().toISOString(),
      level,
      scope: this.scope,
      message,
      ...(meta ?? {}),
    };
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry));
  }

  debug(message: string, meta?: Record<string, unknown>): void { this.emit(LogLevel.DEBUG, message, meta); }
  info(message: string, meta?: Record<string, unknown>): void { this.emit(LogLevel.INFO, message, meta); }
  warn(message: string, meta?: Record<string, unknown>): void { this.emit(LogLevel.WARN, message, meta); }
  error(message: string, meta?: Record<string, unknown>): void { this.emit(LogLevel.ERROR, message, meta); }
}
