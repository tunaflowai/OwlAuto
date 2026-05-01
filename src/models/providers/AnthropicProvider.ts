import {
  CompletionRequest,
  CompletionResponse,
  IModelProvider,
  ModelId,
  ModelVendor,
} from '../IModelProvider';

/**
 * Mock Anthropic provider. Replace `complete()` with a call to
 * `@anthropic-ai/sdk` in production.
 */
export class AnthropicProvider extends IModelProvider {
  readonly vendor = ModelVendor.ANTHROPIC;

  constructor(private readonly apiKey: string = 'mock-key') {
    super();
  }

  supports(model: ModelId): boolean {
    return model.startsWith(`${ModelVendor.ANTHROPIC}:`);
  }

  async complete(req: CompletionRequest): Promise<CompletionResponse> {
    // Stand-in for a real SDK call. The shape mirrors what the runtime expects.
    const text =
      `[anthropic:${req.model}] ${this.apiKey ? '' : ''}` +
      `Analyzed input — proposing structured response based on system prompt ` +
      `("${req.systemPrompt.slice(0, 60)}...") and user message ` +
      `("${req.userMessage.slice(0, 60)}...").`;

    return {
      text,
      model: req.model,
      usage: { promptTokens: req.systemPrompt.length, completionTokens: text.length },
    };
  }
}
