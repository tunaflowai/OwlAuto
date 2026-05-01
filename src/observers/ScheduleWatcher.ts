import { randomUUID } from 'crypto';
import { Logger } from '../utils/logger';
import { TaskPriority } from '../core/types';
import { IObserver, ObserverEmitter } from './IObserver';

export interface ScheduleWatcherOptions {
  readonly id?: string;
  readonly intervalMs: number;
  readonly intent: string;
  readonly sessionId: string;
  readonly payload?: Record<string, unknown>;
}

/**
 * Cron-like observer for recurring jobs (daily ops digest, periodic
 * inventory checks, cleanup sweeps…).
 */
export class ScheduleWatcher implements IObserver {
  readonly id: string;
  private timer?: NodeJS.Timeout;
  private readonly log = new Logger('ScheduleWatcher');

  constructor(private readonly opts: ScheduleWatcherOptions) {
    this.id = opts.id ?? `observer:schedule:${opts.intent}`;
  }

  async start(emit: ObserverEmitter): Promise<void> {
    this.timer = setInterval(() => {
      void emit({
        id: randomUUID(),
        sessionId: this.opts.sessionId,
        source: this.id,
        intent: this.opts.intent,
        payload: this.opts.payload ?? {},
        priority: TaskPriority.NORMAL,
        createdAt: new Date(),
      });
    }, this.opts.intervalMs);
    this.log.info('schedule watcher started', { intent: this.opts.intent });
  }

  async stop(): Promise<void> {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }
}
