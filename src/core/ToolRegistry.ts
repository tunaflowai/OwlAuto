import { Logger } from '../utils/logger';

/**
 * JSON-Schema-like descriptor used for LLM tool-calling and runtime validation.
 */
export interface ToolParameterSchema {
  readonly type: 'object';
  readonly properties: Record<string, { type: string; description?: string }>;
  readonly required?: readonly string[];
}

export interface ToolDefinition<TInput = unknown, TOutput = unknown> {
  readonly name: string;
  readonly description: string;
  readonly schema: ToolParameterSchema;
  readonly handler: (input: TInput) => Promise<TOutput> | TOutput;
}

/**
 * Registry pattern: a single source of truth for executable tools the agent
 * may invoke. Skills register tools here when activated, decoupling
 * capability declaration from runtime execution.
 */
export class ToolRegistry {
  private readonly tools = new Map<string, ToolDefinition>();
  private readonly log = new Logger('ToolRegistry');

  register<I, O>(tool: ToolDefinition<I, O>): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool already registered: ${tool.name}`);
    }
    this.tools.set(tool.name, tool as ToolDefinition);
    this.log.debug('tool registered', { name: tool.name });
  }

  unregister(name: string): boolean {
    return this.tools.delete(name);
  }

  has(name: string): boolean {
    return this.tools.has(name);
  }

  get<I = unknown, O = unknown>(name: string): ToolDefinition<I, O> {
    const tool = this.tools.get(name);
    if (!tool) throw new Error(`Tool not found: ${name}`);
    return tool as ToolDefinition<I, O>;
  }

  list(): ReadonlyArray<ToolDefinition> {
    return Array.from(this.tools.values());
  }

  async invoke<I, O>(name: string, input: I): Promise<O> {
    const tool = this.get<I, O>(name);
    this.log.info('invoking tool', { name });
    return await tool.handler(input);
  }
}
