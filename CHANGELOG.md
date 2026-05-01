# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Repository governance: `LICENSE`, `README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`
- `.github/` issue templates, pull request template, and CI workflow

### Changed

- _(none yet)_

### Fixed

- _(none yet)_

## [0.1.0] - 2026-05-01

Initial public release of the OwlAuto framework.

### Added

#### Core runtime (`src/core/`)

- `AgentRuntime` orchestrator with persona + skill activation lifecycle
- `StateEngine` with pluggable `IStateBackend` and an in-memory backend
- `ToolRegistry` for runtime tool registration with JSON-schema parameter descriptors
- Shared types: `AgentTask`, `AgentResult`, `TaskStatus`, `TaskPriority`

#### Model routing (`src/models/`)

- `IModelProvider` abstract class for vendor-specific completion strategies
- `ModelRouter` with vendor-prefixed model IDs and fallback chain
- Mock providers: `AnthropicProvider`, `GeminiProvider`, `LocalProvider`

#### Channels (`src/channels/`)

- `IChannelAdapter` contract with bidirectional messaging
- `ChannelRegistry` for runtime channel lookup and lifecycle
- Mock adapters: `SlackChannel`, `WhatsAppChannel`

#### Observers (`src/observers/`)

- `IObserver` interface for autonomous task emission
- `MarketWatcher` — emits tasks on price moves above a configurable threshold
- `ScheduleWatcher` — cron-like recurring task emitter
- `ObserverManager` — start / stop / register lifecycle for the dashboard

#### Personas + Skills (`src/personas/`, `src/skills/`)

- `IPersona` strategy interface and `PersonaRegistry`
- `ISkill` lifecycle interface and `SkillRegistry`
- Built-in personas: `AlgorithmicTraderPersona`, `FnBManagerPersona`
- Built-in skills: `BrowserOperatorSkill`, `SupplyChainCoordinatorSkill`

#### Sandbox (`src/sandbox/`)

- `SandboxRunner` conceptual interface for isolated code execution
- `SandboxLanguage` enum (JavaScript, Python, Shell)

#### Localhost dashboard (`src/server/`)

- `OwlAutoServer` zero-dependency HTTP server on port `3000`
- Black-brown gradient owl theme with Bootstrap 5 from CDN
- Inline SVG logo and favicon
- Live status, personas, skills, channels, observers, tools panels
- Manual task runner, channel message dispatch, market watcher registration
- Secure sandbox executor and session state inspector
- Live activity log streamed from the Logger ring buffer

#### REST API

- `GET  /api/status` — runtime status and metrics
- `GET  /api/personas` `/skills` `/channels` `/observers` `/tools` `/logs`
- `GET  /api/state/:sessionId` — session memory snapshot
- `POST /api/observers/:id/start` `/stop` `/stop-all`
- `POST /api/observers/market` — register a new `MarketWatcher` at runtime
- `POST /api/tasks` — execute a task on any persona
- `POST /api/channels/:id/send` — dispatch outbound message
- `POST /api/sandbox` — execute code in the sandbox runner

#### Tooling

- Strict TypeScript configuration (`strict`, `noUnusedLocals`, `noUnusedParameters`, etc.)
- Path aliases for all module groups
- npm scripts: `serve`, `demo`, `build`, `start`, `typecheck`, `lint`
- Logger with structured JSON output and a 500-entry ring buffer

[Unreleased]: https://github.com/tunaflowai/owlauto/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/tunaflowai/owlauto/releases/tag/v0.1.0
