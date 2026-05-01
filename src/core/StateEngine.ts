import { SessionId } from './types';

/**
 * A typed key/value scope per agent session. Pluggable backends (Redis,
 * Postgres, in-process) can implement IStateBackend without affecting callers.
 */
export interface IStateBackend {
  get<T>(session: SessionId, key: string): Promise<T | undefined>;
  set<T>(session: SessionId, key: string, value: T): Promise<void>;
  delete(session: SessionId, key: string): Promise<void>;
  list(session: SessionId): Promise<Record<string, unknown>>;
  clear(session: SessionId): Promise<void>;
}

/**
 * Default in-memory backend. Useful for local dev and ephemeral agents.
 */
export class InMemoryStateBackend implements IStateBackend {
  private readonly store = new Map<SessionId, Map<string, unknown>>();

  private scope(session: SessionId): Map<string, unknown> {
    let s = this.store.get(session);
    if (!s) {
      s = new Map();
      this.store.set(session, s);
    }
    return s;
  }

  async get<T>(session: SessionId, key: string): Promise<T | undefined> {
    return this.scope(session).get(key) as T | undefined;
  }
  async set<T>(session: SessionId, key: string, value: T): Promise<void> {
    this.scope(session).set(key, value);
  }
  async delete(session: SessionId, key: string): Promise<void> {
    this.scope(session).delete(key);
  }
  async list(session: SessionId): Promise<Record<string, unknown>> {
    return Object.fromEntries(this.scope(session).entries());
  }
  async clear(session: SessionId): Promise<void> {
    this.store.delete(session);
  }
}

/**
 * Facade exposing typed memory operations to the runtime, personas, and skills.
 * The backend strategy is injected, keeping the engine swappable.
 */
export class StateEngine {
  constructor(private readonly backend: IStateBackend = new InMemoryStateBackend()) {}

  remember<T>(session: SessionId, key: string, value: T): Promise<void> {
    return this.backend.set(session, key, value);
  }

  recall<T>(session: SessionId, key: string): Promise<T | undefined> {
    return this.backend.get<T>(session, key);
  }

  forget(session: SessionId, key: string): Promise<void> {
    return this.backend.delete(session, key);
  }

  snapshot(session: SessionId): Promise<Record<string, unknown>> {
    return this.backend.list(session);
  }

  reset(session: SessionId): Promise<void> {
    return this.backend.clear(session);
  }
}
