import { ToolDefinition } from '../core/ToolRegistry';

export enum ModelVendor {
  ANTHROPIC = 'anthropic',
  GEMINI = 'gemini',
  LOCAL = 'local',
}

/**
 * Logical model identifier — vendor-prefixed to avoid collisions across
 * providers (e.g. "anthropic:claude-opus-4-7", "gemini:1.5-pro").
 */
export type ModelId = `${ModelVendor}:${string}`;

export interface CompletionRequest {
  readonly model: ModelId;
  readonly systemPrompt: string;
  readonly userMessage: string;
  readonly tools?: ReadonlyArray<ToolDefinition>;
  readonly temperature?: number;
  readonly maxTokens?: number;
}

export interface ToolCall {
  readonly name: string;
  readonly arguments: Record<string, unknown>;
}

export interface CompletionResponse {
  readonly text: string;
  readonly toolCalls?: ReadonlyArray<ToolCall>;
  readonly usage?: { promptTokens: number; completionTokens: number };
  readonly model: ModelId;
}

/**
 * Strategy interface every concrete provider must implement.
 */
export abstract class IModelProvider {
  abstract readonly vendor: ModelVendor;
  abstract supports(model: ModelId): boolean;
  abstract complete(req: CompletionRequest): Promise<CompletionResponse>;
}
