import {
  CompletionRequest,
  CompletionResponse,
  IModelProvider,
  ModelId,
  ModelVendor,
} from '../IModelProvider';

/**
 * Stub for self-hosted models (Ollama, vLLM, llama.cpp). Useful as a
 * cost-sensitive fallback or for offline/air-gapped deployments.
 */
export class LocalProvider extends IModelProvider {
  readonly vendor = ModelVendor.LOCAL;

  constructor(private readonly endpoint: string = 'http://localhost:11434') {
    super();
  }

  supports(model: ModelId): boolean {
    return model.startsWith(`${ModelVendor.LOCAL}:`);
  }

  async complete(req: CompletionRequest): Promise<CompletionResponse> {
    const text = `[local@${this.endpoint}] echo: ${req.userMessage.slice(0, 100)}`;
    return { text, model: req.model };
  }
}
