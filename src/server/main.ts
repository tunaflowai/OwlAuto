/**
 * OwlAuto dashboard launcher — starts the localhost control center.
 *
 *   npm run serve
 *   open http://localhost:3000
 */

import { AgentRuntime } from '../core/AgentRuntime';
import { StateEngine } from '../core/StateEngine';
import { ToolRegistry } from '../core/ToolRegistry';

import { ChannelRegistry } from '../channels/ChannelRegistry';
import { SlackChannel } from '../channels/adapters/SlackChannel';
import { WhatsAppChannel } from '../channels/adapters/WhatsAppChannel';

import { ModelRouter } from '../models/ModelRouter';
import { AnthropicProvider } from '../models/providers/AnthropicProvider';
import { GeminiProvider } from '../models/providers/GeminiProvider';
import { LocalProvider } from '../models/providers/LocalProvider';
import { ModelVendor } from '../models/IModelProvider';

import { PersonaRegistry } from '../personas/PersonaRegistry';
import { AlgorithmicTraderPersona } from '../personas/definitions/AlgorithmicTrader';
import { FnBManagerPersona } from '../personas/definitions/FnBManager';

import { SkillRegistry } from '../skills/SkillRegistry';
import { BrowserOperatorSkill } from '../skills/definitions/BrowserOperator';
import { SupplyChainCoordinatorSkill } from '../skills/definitions/SupplyChainCoordinator';

import { MarketWatcher } from '../observers/MarketWatcher';
import { ScheduleWatcher } from '../observers/ScheduleWatcher';
import { ObserverManager } from '../observers/ObserverManager';
import { AgentTask } from '../core/types';

import { OwlAutoServer } from './OwlAutoServer';
import { Logger } from '../utils/logger';

async function bootstrap(): Promise<void> {
  const log = new Logger('Server.Bootstrap');

  // Models
  const modelRouter = new ModelRouter({
    defaultVendor: ModelVendor.ANTHROPIC,
    fallback: [`${ModelVendor.LOCAL}:llama3-8b`],
  })
    .register(new AnthropicProvider(process.env.ANTHROPIC_API_KEY))
    .register(new GeminiProvider(process.env.GEMINI_API_KEY))
    .register(new LocalProvider());

  // Channels
  const channels = new ChannelRegistry()
    .register(new SlackChannel({ id: 'slack:primary', defaultChannel: '#trading-desk' }))
    .register(new WhatsAppChannel({ id: 'whatsapp:primary' }));
  await channels.startAll();

  // Skills + Personas
  const skills = new SkillRegistry()
    .register(new BrowserOperatorSkill())
    .register(new SupplyChainCoordinatorSkill());

  const personas = new PersonaRegistry()
    .register(new AlgorithmicTraderPersona())
    .register(new FnBManagerPersona());

  // Runtime
  const runtime = new AgentRuntime({
    modelRouter, channels,
    state: new StateEngine(),
    tools: new ToolRegistry(),
  });

  // Observer manager — every observer-emitted task is forwarded into the
  // runtime using the persona referenced by the watcher's session, with a
  // fallback to the AlgorithmicTrader for the demo.
  const observers = new ObserverManager(async <P>(task: AgentTask<P>) => {
    const persona = personas.get('persona:algorithmic-trader');
    const personaSkills = skills.resolveAll(persona.requiredSkillIds);
    const result = await runtime.execute(task, { persona, skills: personaSkills });
    log.info('observer task processed', {
      id: task.id, intent: task.intent, status: result.status,
    });
    await runtime.dispatch(
      'slack:primary', '#trading-desk',
      `Auto-task ${task.intent}: ${String(result.data ?? result.error ?? 'no output')}`,
    ).catch(() => undefined);
  });

  // Pre-register a couple of observers so the dashboard has something to start.
  observers.register(new MarketWatcher({
    sessionId: 'session:dashboard', symbol: 'BTC-USD',
    thresholdPct: 3, intervalMs: 1500,
  }));
  observers.register(new ScheduleWatcher({
    sessionId: 'session:dashboard', intervalMs: 30_000,
    intent: 'periodic_health_check',
  }));

  // Server
  const server = new OwlAutoServer({
    runtime, channels, personas, skills, observers,
    port: Number(process.env.PORT ?? 3000),
  });
  await server.listen();

  // Graceful shutdown
  const shutdown = async (sig: string): Promise<void> => {
    log.warn('shutting down', { signal: sig });
    await observers.stopAll();
    await channels.stopAll();
    await server.close();
    process.exit(0);
  };
  process.on('SIGINT',  () => void shutdown('SIGINT'));
  process.on('SIGTERM', () => void shutdown('SIGTERM'));
}

bootstrap().catch(err => {
  // eslint-disable-next-line no-console
  console.error('Server bootstrap failed:', err);
  process.exit(1);
});
