import { AgentTask } from '../core/types';
import { IObserver, ObserverEmitter } from './IObserver';

export interface ObserverEntry {
  readonly id: string;
  readonly observer: IObserver;
  running: boolean;
  startedAt?: Date;
}

/**
 * Tracks observer instances and their running state. The HTTP API uses this
 * to start/stop watchers on demand from the dashboard.
 */
export class ObserverManager {
  private readonly entries = new Map<string, ObserverEntry>();

  constructor(private readonly emit: ObserverEmitter) {}

  register(observer: IObserver): this {
    if (this.entries.has(observer.id)) {
      throw new Error(`Observer already registered: ${observer.id}`);
    }
    this.entries.set(observer.id, { id: observer.id, observer, running: false });
    return this;
  }

  list(): ReadonlyArray<Omit<ObserverEntry, 'observer'>> {
    return Array.from(this.entries.values()).map(({ id, running, startedAt }) => ({
      id, running, startedAt,
    }));
  }

  async start(id: string): Promise<void> {
    const entry = this.require(id);
    if (entry.running) return;
    await entry.observer.start(this.emit as <P>(t: AgentTask<P>) => Promise<void>);
    entry.running = true;
    entry.startedAt = new Date();
  }

  async stop(id: string): Promise<void> {
    const entry = this.require(id);
    if (!entry.running) return;
    await entry.observer.stop();
    entry.running = false;
    entry.startedAt = undefined;
  }

  async stopAll(): Promise<void> {
    await Promise.all([...this.entries.keys()].map(id => this.stop(id)));
  }

  private require(id: string): ObserverEntry {
    const e = this.entries.get(id);
    if (!e) throw new Error(`Observer not found: ${id}`);
    return e;
  }
}
