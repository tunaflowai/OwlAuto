/**
 * OwlAuto — End-to-end demonstration.
 *
 * Scenario:
 *   A MarketWatcher observes BTC-USD. When the price moves more than 3%
 *   between ticks, it autonomously emits an `analyze_price_alert` task.
 *   The AgentRuntime hydrates the AlgorithmicTrader persona (with the
 *   BrowserOperator skill), routes the prompt through the ModelRouter
 *   (Anthropic provider), and delivers the analysis to the Slack channel.
 */

import { AgentRuntime } from './core/AgentRuntime';
import { StateEngine } from './core/StateEngine';
import { ToolRegistry } from './core/ToolRegistry';
import { AgentTask } from './core/types';

import { ModelRouter } from './models/ModelRouter';
import { AnthropicProvider } from './models/providers/AnthropicProvider';
import { GeminiProvider } from './models/providers/GeminiProvider';
import { LocalProvider } from './models/providers/LocalProvider';
import { ModelVendor } from './models/IModelProvider';

import { ChannelRegistry } from './channels/ChannelRegistry';
import { SlackChannel } from './channels/adapters/SlackChannel';

import { MarketWatcher, MarketTick } from './observers/MarketWatcher';

import { PersonaRegistry } from './personas/PersonaRegistry';
import { AlgorithmicTraderPersona } from './personas/definitions/AlgorithmicTrader';

import { SkillRegistry } from './skills/SkillRegistry';
import { BrowserOperatorSkill } from './skills/definitions/BrowserOperator';

import { Logger } from './utils/logger';

async function bootstrap(): Promise<void> {
  const log = new Logger('Bootstrap');

  // ── 1. Wire the model router with multiple providers + fallbacks ───────────
  const modelRouter = new ModelRouter({
    defaultVendor: ModelVendor.ANTHROPIC,
    fallback: [`${ModelVendor.LOCAL}:llama3-8b`],
  })
    .register(new AnthropicProvider(process.env.ANTHROPIC_API_KEY))
    .register(new GeminiProvider(process.env.GEMINI_API_KEY))
    .register(new LocalProvider());

  // ── 2. Channels ───────────────────────────────────────────────────────────
  const channels = new ChannelRegistry();
  const slack = new SlackChannel({ id: 'slack:primary', defaultChannel: '#trading-desk' });
  channels.register(slack);
  await channels.startAll();

  // ── 3. Skills + Personas registries ───────────────────────────────────────
  const skills = new SkillRegistry().register(new BrowserOperatorSkill());
  const personas = new PersonaRegistry().register(new AlgorithmicTraderPersona());

  // ── 4. Runtime ────────────────────────────────────────────────────────────
  const runtime = new AgentRuntime({
    modelRouter,
    channels,
    state: new StateEngine(),
    tools: new ToolRegistry(),
  });

  // ── 5. Observer → Runtime → Channel pipeline ──────────────────────────────
  const trader = personas.get('persona:algorithmic-trader');
  const traderSkills = skills.resolveAll(trader.requiredSkillIds);

  const handleTask = async <P>(task: AgentTask<P>): Promise<void> => {
    log.info('observer emitted task', { intent: task.intent, source: task.source });

    const result = await runtime.execute(task, {
      persona: trader,
      skills: traderSkills,
    });

    const tick = task.payload as MarketTick;
    const summary =
      `[BTC-USD price alert] ${tick.changePct.toFixed(2)}% move ` +
      `(${tick.previous.toFixed(2)} → ${tick.price.toFixed(2)}).\n` +
      `Trader analysis: ${String(result.data ?? '(no output)')}`;

    await runtime.dispatch('slack:primary', '#trading-desk', summary);
  };

  // ── 6. Spin up the MarketWatcher (autonomous trigger) ─────────────────────
  const watcher = new MarketWatcher({
    sessionId: 'session:demo-trader-1',
    symbol: 'BTC-USD',
    thresholdPct: 3,
    intervalMs: 500,
  });
  await watcher.start(handleTask);

  log.info('OwlAuto demo running — emitting alerts autonomously...');

  // Run for a short window for the demo, then shut down cleanly.
  setTimeout(async () => {
    await watcher.stop();
    await channels.stopAll();
    log.info('OwlAuto demo finished.');
    process.exit(0);
  }, 4_000);
}

// ── Entry-point ─────────────────────────────────────────────────────────────
bootstrap().catch(err => {
  // eslint-disable-next-line no-console
  console.error('Fatal bootstrap error:', err);
  process.exit(1);
});

// Re-export public surface so consumers can `import { ... } from 'owlauto'`.
export * from './core';
export * from './models';
export * from './channels';
export * from './observers';
export * from './personas';
export * from './skills';
export * from './sandbox';
export * from './server';
