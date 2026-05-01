/**
 * Cross-cutting types shared across the OwlAuto runtime.
 */

export type AgentId = string;
export type SessionId = string;

export enum TaskStatus {
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum TaskPriority {
  LOW = 0,
  NORMAL = 1,
  HIGH = 2,
  CRITICAL = 3,
}

/**
 * The unit of work the AgentRuntime executes. Trigger payloads from
 * Observers, Channels, or external systems are normalised into AgentTasks.
 */
export interface AgentTask<TPayload = unknown> {
  readonly id: string;
  readonly sessionId: SessionId;
  readonly source: string;            // e.g. "observer:market", "channel:slack"
  readonly intent: string;            // e.g. "analyze_price_drop"
  readonly payload: TPayload;
  readonly priority: TaskPriority;
  readonly createdAt: Date;
}

export interface AgentResult<TData = unknown> {
  readonly taskId: string;
  readonly status: TaskStatus;
  readonly data?: TData;
  readonly error?: string;
  readonly durationMs: number;
}
