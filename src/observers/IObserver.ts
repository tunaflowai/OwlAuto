import { AgentTask } from '../core/types';

/**
 * Observer pattern: emits AgentTasks autonomously when an external condition
 * is met (price threshold, cron tick, webhook, queue message…).
 * The runtime treats every observer the same way.
 */
export type ObserverEmitter = <P>(task: AgentTask<P>) => Promise<void> | void;

export interface IObserver {
  readonly id: string;
  /** Begin watching. Implementations should be idempotent. */
  start(emit: ObserverEmitter): Promise<void>;
  /** Stop the underlying timer/socket/subscription. */
  stop(): Promise<void>;
}
