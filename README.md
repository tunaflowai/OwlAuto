<div align="center">

<img src="https://raw.githubusercontent.com/tunaflowai/owlauto/main/assets/owl-logo.svg" alt="OwlAuto" width="120" />

# OwlAuto

**Enterprise-grade autonomous AI agent framework for Node.js + TypeScript.**

[![License: MIT](https://img.shields.io/badge/license-MIT-d4a04c.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-2b1d12.svg)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/typescript-strict-3178c6.svg)](https://www.typescriptlang.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-d4a04c.svg)](./CONTRIBUTING.md)

</div>

---

OwlAuto is a modular runtime for building **autonomous, multi-channel, multi-model agents** that observe the world, reason with an LLM, and act through tools — without being tied to any single vendor or surface.

It is designed for teams that need to ship agents into production: trading desks, F&B operations, customer support, ops automation. The framework is **LLM-agnostic**, **channel-agnostic**, and **observable**, with a built-in localhost dashboard for operators.

## Table of Contents

- [Why OwlAuto](#why-owlauto)
- [Features](#features)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Project Layout](#project-layout)
- [Personas and Skills](#personas-and-skills)
- [Dashboard](#dashboard)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Why OwlAuto

Most agent frameworks bind you to one model, one channel, or one orchestration style. OwlAuto separates these concerns cleanly:

- **Models** are strategies behind a `ModelRouter` — swap Anthropic for Gemini, or fall back to a self-hosted model, without touching agent logic.
- **Channels** (Slack, WhatsApp, Email, custom) are adapters behind a single `IChannelAdapter` contract.
- **Personas** shape character and competencies; **Skills** mount the actual executable tools at runtime.
- **Observers** trigger agents autonomously from the outside world — market ticks, cron jobs, webhooks.
- **Sandbox** isolates generated or untrusted code execution.

The same `AgentRuntime` orchestrates all of it.

## Features

- **Strict TypeScript** with enums, generics, and interfaces throughout
- **Pluggable LLM providers** (Anthropic, Gemini, Local) with automatic fallback
- **Omnichannel adapters** with bidirectional messaging (Slack and WhatsApp included)
- **Autonomous observers** (`MarketWatcher`, `ScheduleWatcher`) that emit `AgentTask`s
- **Persona + Skill system** with lifecycle hooks (`activate` / `deactivate`)
- **Tool registry** with JSON-schema parameter descriptors for LLM tool-calling
- **Pluggable state engine** with an in-memory backend out of the box
- **Conceptual sandbox** for executing generated code safely
- **Localhost dashboard** with owl theme, Bootstrap UI, and full operator controls
- **Zero runtime dependencies** — built on Node's standard library

## Quick Start

### Requirements

- Node.js >= 18
- npm >= 9

### Install

```bash
git clone https://github.com/tunaflowai/owlauto.git
cd owlauto
npm install
```

### Run the dashboard

```bash
npm run serve
# → OwlAuto dashboard listening at http://localhost:3000
```

Open <http://localhost:3000> for the operator console.

### Run the headless demo

A `MarketWatcher` triggers an `AlgorithmicTrader` persona to analyse a price move and post the result to a Slack channel:

```bash
npm run demo
```

### Use as a library

```ts
import {
  AgentRuntime,
  ModelRouter,
  AnthropicProvider,
  ChannelRegistry,
  SlackChannel,
  AlgorithmicTraderPersona,
  BrowserOperatorSkill,
  MarketWatcher,
} from 'owlauto';

const router   = new ModelRouter().register(new AnthropicProvider(process.env.ANTHROPIC_API_KEY));
const channels = new ChannelRegistry().register(new SlackChannel());
const runtime  = new AgentRuntime({ modelRouter: router, channels });

const trader = new AlgorithmicTraderPersona();
const skills = [new BrowserOperatorSkill()];

const watcher = new MarketWatcher({
  sessionId:    'demo',
  symbol:       'BTC-USD',
  thresholdPct: 3,
});

await watcher.start(async (task) => {
  const result = await runtime.execute(task, { persona: trader, skills });
  await runtime.dispatch('slack:primary', '#trading-desk', String(result.data));
});
```

## Architecture

```
                         ┌────────────────────┐
                         │     Observers      │   MarketWatcher
                         │  (Observer pattern)│   ScheduleWatcher
                         └─────────┬──────────┘   Webhook / Cron
                                   │ AgentTask
                                   ▼
┌──────────────┐         ┌────────────────────┐         ┌──────────────┐
│   Channels   │◄────────┤    AgentRuntime    ├────────►│   Sandbox    │
│  (Adapters)  │ dispatch│   (Orchestrator)   │  exec   │  (Isolated)  │
│ Slack/WhatsApp/...     └─────────┬──────────┘         └──────────────┘
└──────────────┘                   │
                          ┌────────┼────────┐
                          ▼        ▼        ▼
                    ┌─────────┐ ┌────┐ ┌──────────┐
                    │ Persona │ │Mem │ │  Tools   │
                    │ + Skills│ │   │ │(Registry)│
                    └────┬────┘ └────┘ └──────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ ModelRouter  │   Anthropic
                  │  (Strategy)  │   Gemini
                  └──────────────┘   Local / Self-hosted
```

### Design patterns

| Module | Pattern | Purpose |
|---|---|---|
| `ToolRegistry`, `ChannelRegistry`, `PersonaRegistry`, `SkillRegistry` | Registry | Runtime lookup tables for pluggable components |
| `IModelProvider` + `ModelRouter` | Strategy | LLM-agnostic completion routing with fallback |
| `IObserver` (Market / Schedule) | Observer | Autonomous task emission from external signals |
| `IPersona` | Strategy | Reshape agent behaviour without runtime changes |
| `ISkill` | Plugin / Lifecycle | Mount and unmount tools per task |
| `IStateBackend` | Bridge | Swap in-memory for Redis/Postgres without API changes |
| `IChannelAdapter` | Adapter | Wrap vendor SDKs behind a uniform contract |
| `SandboxRunner` | Facade | One contract over Firecracker / gVisor / V8 isolates / WASM |

## Project Layout

```
src/
├── core/         AgentRuntime, StateEngine, ToolRegistry, types
├── models/       ModelRouter + Anthropic / Gemini / Local providers
├── channels/     IChannelAdapter, ChannelRegistry, Slack / WhatsApp adapters
├── observers/    IObserver, MarketWatcher, ScheduleWatcher, ObserverManager
├── personas/     IPersona, PersonaRegistry, AlgorithmicTrader, FnBManager
├── skills/       ISkill, SkillRegistry, BrowserOperator, SupplyChainCoordinator
├── sandbox/      SandboxRunner (conceptual isolation interface)
├── server/       OwlAutoServer (HTTP), dashboard UI, owl SVG assets
├── utils/        Logger with ring buffer for live activity feed
└── index.ts      End-to-end demo entry point
```

## Personas and Skills

A **Persona** declares character, preferred model, and required skills. The same `AgentRuntime` becomes a different agent depending on the persona it loads.

```ts
class AlgorithmicTraderPersona implements IPersona {
  readonly id              = 'persona:algorithmic-trader';
  readonly preferredModel  = 'anthropic:claude-opus-4-7';
  readonly requiredSkillIds = ['skill:browser-operator'] as const;

  buildSystemPrompt(ctx) { /* ... */ }
}
```

A **Skill** is a bundle of tools mounted into the registry on `activate()` and torn down on `deactivate()`:

```ts
class BrowserOperatorSkill implements ISkill {
  activate(ctx) {
    ctx.tools.register({
      name: 'browser.fetch',
      description: 'Fetch the visible text of a URL.',
      schema: { type: 'object', properties: { url: { type: 'string' } }, required: ['url'] },
      handler: async ({ url }) => { /* ... */ },
    });
  }
}
```

Built-in personas and skills:

| Persona | Required skills |
|---|---|
| `AlgorithmicTrader` | `BrowserOperator` |
| `FnBManager` | `SupplyChainCoordinator` |

## Dashboard

The localhost dashboard at <http://localhost:3000> exposes:

- Live status (uptime, tasks executed, tools registered, channels active)
- Personas / Skills / Channels registries
- Observer start / stop / register-new controls
- Manual task runner (pick persona, intent, JSON payload)
- Channel message dispatch
- Tool registry inspector
- Secure Sandbox executor
- Session state snapshot inspector
- Live activity log streamed from the in-process ring buffer

The theme is a black-brown gradient with amber owl accents, served as a single zero-dependency HTML page.

## Configuration

Environment variables:

| Variable | Description | Default |
|---|---|---|
| `PORT` | Dashboard port | `3000` |
| `ANTHROPIC_API_KEY` | API key for `AnthropicProvider` | `mock-key` |
| `GEMINI_API_KEY` | API key for `GeminiProvider` | `mock-key` |

The default mock providers do not call any external API, so the framework runs out of the box without credentials.

## Scripts

| Script | Description |
|---|---|
| `npm run serve` | Start the dashboard server (ts-node, dev) |
| `npm run demo` | Run the headless end-to-end demo |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run the compiled dashboard server |
| `npm run typecheck` | Strict typecheck without emitting |
| `npm run lint` | Lint the source tree |

## Roadmap

- Real provider implementations behind the mock adapters
- Persistent state backends (Redis, Postgres)
- Production sandbox backends (Firecracker, gVisor, V8 isolates)
- Webhook-driven channel adapters (HTTP, email, SMS)
- Streaming model responses surfaced through the dashboard
- Auth and multi-tenant session isolation in `OwlAutoServer`

## Contributing

We welcome contributions. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for the development workflow, commit conventions, and review process.

## Security

If you discover a vulnerability, **do not open a public issue**. Follow the disclosure process in [SECURITY.md](./SECURITY.md).

## License

OwlAuto is released under the [MIT License](./LICENSE).
