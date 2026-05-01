import { Logger } from '../../utils/logger';
import {
  ChannelKind,
  IChannelAdapter,
  InboundHandler,
  InboundMessage,
  OutboundMessage,
} from '../IChannelAdapter';

export interface SlackChannelOptions {
  readonly id?: string;
  readonly botToken?: string;
  readonly defaultChannel?: string;
}

/**
 * Mock Slack adapter. In production, swap the body of `send()` and
 * `simulateInbound()` for `@slack/web-api` + Events API wiring.
 */
export class SlackChannel implements IChannelAdapter {
  readonly id: string;
  readonly kind = ChannelKind.SLACK;
  private readonly handlers: InboundHandler[] = [];
  private readonly log = new Logger('SlackChannel');

  constructor(private readonly opts: SlackChannelOptions = {}) {
    this.id = opts.id ?? 'slack:primary';
  }

  async start(): Promise<void> { this.log.info('slack channel started', { id: this.id }); }
  async stop(): Promise<void> { this.log.info('slack channel stopped', { id: this.id }); }

  onMessage(handler: InboundHandler): void {
    this.handlers.push(handler);
  }

  async send(msg: OutboundMessage): Promise<void> {
    void this.opts.botToken;
    this.log.info('slack outbound', {
      to: msg.recipient || this.opts.defaultChannel,
      preview: msg.message.slice(0, 120),
    });
  }

  /** Test/demo helper: simulate an inbound Slack event. */
  async simulateInbound(text: string, sender = 'U_DEMO'): Promise<void> {
    const msg: InboundMessage = {
      channel: this.kind,
      sender,
      text,
      receivedAt: new Date(),
    };
    for (const h of this.handlers) await h(msg);
  }
}
