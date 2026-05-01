export enum ChannelKind {
  SLACK = 'slack',
  WHATSAPP = 'whatsapp',
  EMAIL = 'email',
  WEB = 'web',
  CUSTOM = 'custom',
}

export interface InboundMessage {
  readonly channel: ChannelKind;
  readonly sender: string;          // External user id (slack uid, phone number…)
  readonly text: string;
  readonly raw?: unknown;           // Provider-native payload
  readonly receivedAt: Date;
}

export interface OutboundMessage {
  readonly recipient: string;
  readonly message: string;
  readonly attachments?: ReadonlyArray<{ name: string; url: string }>;
}

export type InboundHandler = (msg: InboundMessage) => Promise<void> | void;

/**
 * Bidirectional bridge between OwlAuto and an external messaging surface.
 * Implementations wrap vendor SDKs and translate to/from OwlAuto types.
 */
export interface IChannelAdapter {
  readonly id: string;
  readonly kind: ChannelKind;

  start(): Promise<void>;
  stop(): Promise<void>;

  /** Subscribe to inbound messages from this channel. */
  onMessage(handler: InboundHandler): void;

  /** Send an outbound message. */
  send(msg: OutboundMessage): Promise<void>;
}
