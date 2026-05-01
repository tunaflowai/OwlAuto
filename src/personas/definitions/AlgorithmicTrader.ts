import { IPersona, PersonaPromptContext } from '../IPersona';
import { ModelId, ModelVendor } from '../../models/IModelProvider';

/**
 * Quant-style trading persona. Reasons over price ticks, applies risk
 * heuristics, and produces structured recommendations.
 */
export class AlgorithmicTraderPersona implements IPersona {
  readonly id = 'persona:algorithmic-trader';
  readonly name = 'Algorithmic Trader';
  readonly description = 'Reacts to market signals with risk-aware trade analysis.';
  readonly preferredModel: ModelId = `${ModelVendor.ANTHROPIC}:claude-opus-4-7`;
  readonly requiredSkillIds = ['skill:browser-operator'] as const;

  buildSystemPrompt<P>(ctx: PersonaPromptContext<P>): string {
    return [
      'You are OwlAuto-Trader, an algorithmic trading analyst.',
      'Constraints: never recommend leverage above 2x; always cite the % move that triggered the signal.',
      `Available tools: ${ctx.availableTools.join(', ') || '(none)'}.`,
      `Recent memory keys: ${Object.keys(ctx.memory).join(', ') || '(empty)'}.`,
      `Current task intent: ${ctx.task.intent} (source=${ctx.task.source}).`,
      'Respond with: 1) signal summary, 2) recommended action, 3) confidence 0-1.',
    ].join('\n');
  }
}
