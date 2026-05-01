import { ToolRegistry } from '../core/ToolRegistry';
import { StateEngine } from '../core/StateEngine';

export interface SkillContext {
  readonly tools: ToolRegistry;
  readonly state: StateEngine;
}

/**
 * A Skill is a bundle of related tools/capabilities a Persona can be granted.
 * On `activate`, it registers its tools into the shared ToolRegistry.
 * On `deactivate`, it can clean those tools up.
 */
export interface ISkill {
  readonly id: string;
  readonly description: string;
  activate(ctx: SkillContext): Promise<void> | void;
  deactivate?(): Promise<void> | void;
}
