import { IChannelAdapter, InboundHandler } from './IChannelAdapter';

/**
 * Registry pattern across all active channel adapters. The runtime dispatches
 * outbound messages by `id`, while inbound handlers can be wired here to
 * forward into the AgentRuntime.
 */
export class ChannelRegistry {
  private readonly channels = new Map<string, IChannelAdapter>();

  register(adapter: IChannelAdapter): this {
    if (this.channels.has(adapter.id)) {
      throw new Error(`Channel already registered: ${adapter.id}`);
    }
    this.channels.set(adapter.id, adapter);
    return this;
  }

  get(id: string): IChannelAdapter {
    const c = this.channels.get(id);
    if (!c) throw new Error(`Channel not found: ${id}`);
    return c;
  }

  list(): ReadonlyArray<IChannelAdapter> {
    return Array.from(this.channels.values());
  }

  async startAll(): Promise<void> {
    await Promise.all(this.list().map(c => c.start()));
  }

  async stopAll(): Promise<void> {
    await Promise.all(this.list().map(c => c.stop()));
  }

  /** Wire a single handler to all channels. */
  bindGlobalInboundHandler(handler: InboundHandler): void {
    for (const c of this.list()) c.onMessage(handler);
  }
}
