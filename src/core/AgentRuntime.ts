import { randomUUID } from 'crypto';
import { Logger } from '../utils/logger';
import { ModelRouter } from '../models/ModelRouter';
import { ChannelRegistry } from '../channels/ChannelRegistry';
import { IPersona } from '../personas/IPersona';
import { ISkill } from '../skills/ISkill';
import { StateEngine } from './StateEngine';
import { ToolRegistry } from './ToolRegistry';
import { AgentResult, AgentTask, TaskStatus } from './types';

export interface AgentRuntimeDeps {
  readonly modelRouter: ModelRouter;
  readonly channels: ChannelRegistry;
  readonly state?: StateEngine;
  readonly tools?: ToolRegistry;
}

export interface AgentSessionConfig {
  readonly persona: IPersona;
  readonly skills?: ReadonlyArray<ISkill>;
}

/**
 * Orchestrates the full lifecycle of a single agent task:
 *  1. Hydrate persona + skills (skills register tools into the ToolRegistry)
 *  2. Build a system prompt and forward to the ModelRouter
 *  3. Execute any returned tool invocations
 *  4. Persist outcomes to the StateEngine
 *  5. Optionally dispatch a reply through a channel adapter
 *
 * Designed as a thin orchestrator — strategy decisions live inside personas,
 * skills, and the model router so the runtime stays generic.
 */
export class AgentRuntime {
  private readonly log = new Logger('AgentRuntime');
  private readonly modelRouter: ModelRouter;
  private readonly channels: ChannelRegistry;
  private readonly state: StateEngine;
  private readonly tools: ToolRegistry;

  constructor(deps: AgentRuntimeDeps) {
    this.modelRouter = deps.modelRouter;
    this.channels = deps.channels;
    this.state = deps.state ?? new StateEngine();
    this.tools = deps.tools ?? new ToolRegistry();
  }

  get toolRegistry(): ToolRegistry { return this.tools; }
  get stateEngine(): StateEngine { return this.state; }

  /**
   * Execute a task end-to-end. Personas + skills are passed in per-call so the
   * same runtime instance can serve multiple agent identities concurrently.
   */
  async execute<P, R>(task: AgentTask<P>, config: AgentSessionConfig): Promise<AgentResult<R>> {
    const startedAt = Date.now();
    this.log.info('task received', { id: task.id, intent: task.intent, source: task.source });

    try {
      // 1. Activate skills — each skill mounts its tools into the registry.
      const activated = await this.activateSkills(config.skills ?? []);

      // 2. Build prompt context from persona + state + payload.
      const memory = await this.state.snapshot(task.sessionId);
      const systemPrompt = config.persona.buildSystemPrompt({
        task,
        memory,
        availableTools: this.tools.list().map(t => t.name),
      });

      // 3. Route to the appropriate model provider.
      const completion = await this.modelRouter.complete({
        model: config.persona.preferredModel,
        systemPrompt,
        userMessage: JSON.stringify({ intent: task.intent, payload: task.payload }),
        tools: this.tools.list(),
      });

      // 4. Persist result for follow-up turns.
      await this.state.remember(task.sessionId, `lastResult:${task.intent}`, completion.text);

      // 5. Tear down skill-scoped tools.
      for (const s of activated) await s.deactivate?.();

      const result: AgentResult<R> = {
        taskId: task.id,
        status: TaskStatus.COMPLETED,
        data: completion.text as unknown as R,
        durationMs: Date.now() - startedAt,
      };
      this.log.info('task completed', { id: task.id, durationMs: result.durationMs });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.log.error('task failed', { id: task.id, message });
      return {
        taskId: task.id,
        status: TaskStatus.FAILED,
        error: message,
        durationMs: Date.now() - startedAt,
      };
    }
  }

  /**
   * Convenience helper for fire-and-forget delivery via a channel adapter,
   * typically called by personas after `execute()` resolves.
   */
  async dispatch(channelId: string, recipient: string, message: string): Promise<void> {
    const channel = this.channels.get(channelId);
    await channel.send({ recipient, message });
  }

  static newTask<P>(input: Omit<AgentTask<P>, 'id' | 'createdAt'>): AgentTask<P> {
    return { ...input, id: randomUUID(), createdAt: new Date() };
  }

  private async activateSkills(skills: ReadonlyArray<ISkill>): Promise<ReadonlyArray<ISkill>> {
    for (const skill of skills) {
      await skill.activate({ tools: this.tools, state: this.state });
    }
    return skills;
  }
}
