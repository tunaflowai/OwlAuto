import { randomUUID } from 'crypto';
import { Logger } from '../utils/logger';
import { TaskPriority } from '../core/types';
import { IObserver, ObserverEmitter } from './IObserver';

export interface MarketTick {
  readonly symbol: string;
  readonly price: number;
  readonly previous: number;
  readonly changePct: number;
  readonly at: Date;
}

export interface MarketWatcherOptions {
  readonly id?: string;
  readonly symbol: string;
  /** Absolute % change that triggers an alert. */
  readonly thresholdPct: number;
  /** Polling cadence in milliseconds. */
  readonly intervalMs?: number;
  /** Optional price source — defaults to a deterministic mock random walk. */
  readonly source?: () => Promise<number>;
  /** Session id used for emitted tasks. Allows multi-tenant routing. */
  readonly sessionId: string;
}

/**
 * Observes a market symbol and emits an `analyze_price_alert` AgentTask
 * whenever the price moves more than `thresholdPct` between ticks.
 */
export class MarketWatcher implements IObserver {
  readonly id: string;
  private readonly log = new Logger('MarketWatcher');
  private timer?: NodeJS.Timeout;
  private lastPrice?: number;

  constructor(private readonly opts: MarketWatcherOptions) {
    this.id = opts.id ?? `observer:market:${opts.symbol}`;
  }

  async start(emit: ObserverEmitter): Promise<void> {
    const interval = this.opts.intervalMs ?? 1000;
    this.log.info('market watcher started', { symbol: this.opts.symbol, interval });

    const tick = async (): Promise<void> => {
      try {
        const price = await (this.opts.source ?? this.defaultSource).call(this);
        const previous = this.lastPrice ?? price;
        const changePct = previous === 0 ? 0 : ((price - previous) / previous) * 100;
        this.lastPrice = price;

        if (Math.abs(changePct) >= this.opts.thresholdPct) {
          const tickPayload: MarketTick = {
            symbol: this.opts.symbol,
            price,
            previous,
            changePct,
            at: new Date(),
          };
          await emit({
            id: randomUUID(),
            sessionId: this.opts.sessionId,
            source: this.id,
            intent: 'analyze_price_alert',
            payload: tickPayload,
            priority: TaskPriority.HIGH,
            createdAt: new Date(),
          });
        }
      } catch (err) {
        this.log.error('tick failed', { error: err instanceof Error ? err.message : String(err) });
      }
    };

    this.timer = setInterval(tick, interval);
  }

  async stop(): Promise<void> {
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
    this.log.info('market watcher stopped');
  }

  /** Deterministic-ish mock so demos don't depend on a real feed. */
  private async defaultSource(): Promise<number> {
    const base = this.lastPrice ?? 100;
    const drift = (Math.random() - 0.5) * 10;
    return Math.max(1, base + drift);
  }
}
