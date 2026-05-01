import { Logger } from '../../utils/logger';
import {
  ChannelKind,
  IChannelAdapter,
  InboundHandler,
  OutboundMessage,
} from '../IChannelAdapter';

export class WhatsAppChannel implements IChannelAdapter {
  readonly id: string;
  readonly kind = ChannelKind.WHATSAPP;
  private readonly handlers: InboundHandler[] = [];
  private readonly log = new Logger('WhatsAppChannel');

  constructor(opts: { id?: string; phoneNumberId?: string } = {}) {
    this.id = opts.id ?? 'whatsapp:primary';
  }

  async start(): Promise<void> { this.log.info('whatsapp channel started', { id: this.id }); }
  async stop(): Promise<void> { this.log.info('whatsapp channel stopped', { id: this.id }); }

  onMessage(handler: InboundHandler): void {
    this.handlers.push(handler);
  }

  async send(msg: OutboundMessage): Promise<void> {
    this.log.info('whatsapp outbound', { to: msg.recipient, preview: msg.message.slice(0, 120) });
  }
}
