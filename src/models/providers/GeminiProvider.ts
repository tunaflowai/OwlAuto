import {
  CompletionRequest,
  CompletionResponse,
  IModelProvider,
  ModelId,
  ModelVendor,
} from '../IModelProvider';

export class GeminiProvider extends IModelProvider {
  readonly vendor = ModelVendor.GEMINI;

  constructor(private readonly apiKey: string = 'mock-key') {
    super();
  }

  supports(model: ModelId): boolean {
    return model.startsWith(`${ModelVendor.GEMINI}:`);
  }

  async complete(req: CompletionRequest): Promise<CompletionResponse> {
    void this.apiKey;
    const text = `[gemini:${req.model}] Generated reasoning for "${req.userMessage.slice(0, 80)}".`;
    return {
      text,
      model: req.model,
      usage: { promptTokens: req.systemPrompt.length, completionTokens: text.length },
    };
  }
}
