import { ModelId } from '../models/IModelProvider';
import { AgentTask } from '../core/types';

export interface PersonaPromptContext<P = unknown> {
  readonly task: AgentTask<P>;
  readonly memory: Record<string, unknown>;
  readonly availableTools: ReadonlyArray<string>;
}

/**
 * A Persona shapes how a generic agent thinks and behaves. It declares which
 * skills it requires, which model it prefers, and how to assemble a system
 * prompt for the runtime.
 *
 * Strategy pattern: the runtime is identical across personas — only the
 * Persona implementation changes the agent's character & competencies.
 */
export interface IPersona {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly preferredModel: ModelId;
  readonly requiredSkillIds: ReadonlyArray<string>;
  buildSystemPrompt<P>(ctx: PersonaPromptContext<P>): string;
}
