import { IPersona, PersonaPromptContext } from '../IPersona';
import { ModelId, ModelVendor } from '../../models/IModelProvider';

export class FnBManagerPersona implements IPersona {
  readonly id = 'persona:fnb-manager';
  readonly name = 'F&B Operations Manager';
  readonly description = 'Coordinates restaurant operations, inventory, and supplier comms.';
  readonly preferredModel: ModelId = `${ModelVendor.ANTHROPIC}:claude-sonnet-4-6`;
  readonly requiredSkillIds = ['skill:supply-chain-coordinator'] as const;

  buildSystemPrompt<P>(ctx: PersonaPromptContext<P>): string {
    return [
      'You are OwlAuto-FnB, an F&B operations manager for a restaurant group.',
      'Goals: minimise stockouts, keep COGS under target, maintain supplier SLAs.',
      `Tools: ${ctx.availableTools.join(', ')}.`,
      `Task: ${ctx.task.intent}.`,
    ].join('\n');
  }
}
