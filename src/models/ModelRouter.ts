import { Logger } from '../utils/logger';
import {
  CompletionRequest,
  CompletionResponse,
  IModelProvider,
  ModelId,
  ModelVendor,
} from './IModelProvider';

export interface ModelRouterOptions {
  /** Vendor to use when a request doesn't specify one. */
  readonly defaultVendor?: ModelVendor;
  /** Ordered fallback list when the primary provider fails. */
  readonly fallback?: ReadonlyArray<ModelId>;
}

/**
 * Strategy/Registry hybrid: providers register themselves and the router
 * dispatches each request to the right one based on the model's vendor
 * prefix. Keeps the runtime fully LLM-agnostic.
 */
export class ModelRouter {
  private readonly providers = new Map<ModelVendor, IModelProvider>();
  private readonly log = new Logger('ModelRouter');

  constructor(private readonly options: ModelRouterOptions = {}) {}

  register(provider: IModelProvider): this {
    this.providers.set(provider.vendor, provider);
    this.log.debug('provider registered', { vendor: provider.vendor });
    return this;
  }

  async complete(req: CompletionRequest): Promise<CompletionResponse> {
    const candidates: ModelId[] = [req.model, ...(this.options.fallback ?? [])];
    let lastError: unknown;

    for (const model of candidates) {
      const provider = this.resolve(model);
      if (!provider) continue;
      try {
        return await provider.complete({ ...req, model });
      } catch (err) {
        lastError = err;
        this.log.warn('provider failed, trying next', {
          vendor: provider.vendor,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    throw new Error(
      `No provider could fulfil completion. Last error: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`,
    );
  }

  private resolve(model: ModelId): IModelProvider | undefined {
    const vendor = model.split(':')[0] as ModelVendor;
    return this.providers.get(vendor);
  }
}
