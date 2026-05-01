export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export interface LogEntry {
  ts: string;
  level: LogLevel;
  scope: string;
  message: string;
  meta?: Record<string, unknown>;
}

/**
 * Minimal structured logger. Keeps the last N entries in a static ring buffer
 * so the dashboard can stream activity without an external log pipeline.
 */
export class Logger {
  private static readonly buffer: LogEntry[] = [];
  private static readonly subscribers = new Set<(e: LogEntry) => void>();
  private static readonly MAX_BUFFER = 500;

  constructor(private readonly scope: string) {}

  static recent(limit = 100): LogEntry[] {
    return Logger.buffer.slice(-limit);
  }

  static subscribe(fn: (e: LogEntry) => void): () => void {
    Logger.subscribers.add(fn);
    return () => Logger.subscribers.delete(fn);
  }

  private emit(level: LogLevel, message: string, meta?: Record<string, unknown>): void {
    const entry: LogEntry = {
      ts: new Date().toISOString(),
      level,
      scope: this.scope,
      message,
      meta,
    };
    Logger.buffer.push(entry);
    if (Logger.buffer.length > Logger.MAX_BUFFER) Logger.buffer.shift();
    for (const s of Logger.subscribers) {
      try { s(entry); } catch { /* swallow subscriber errors */ }
    }
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry));
  }

  debug(message: string, meta?: Record<string, unknown>): void { this.emit(LogLevel.DEBUG, message, meta); }
  info(message: string, meta?: Record<string, unknown>): void { this.emit(LogLevel.INFO, message, meta); }
  warn(message: string, meta?: Record<string, unknown>): void { this.emit(LogLevel.WARN, message, meta); }
  error(message: string, meta?: Record<string, unknown>): void { this.emit(LogLevel.ERROR, message, meta); }
}
