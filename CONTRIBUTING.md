# Contributing to OwlAuto

Thanks for your interest in improving OwlAuto. This document describes how to set up the project locally, the conventions we follow, and how to get a change merged.

## Table of Contents

- [Ways to contribute](#ways-to-contribute)
- [Development setup](#development-setup)
- [Project structure](#project-structure)
- [Branching model](#branching-model)
- [Commit conventions](#commit-conventions)
- [Coding standards](#coding-standards)
- [Testing your changes](#testing-your-changes)
- [Submitting a pull request](#submitting-a-pull-request)
- [Adding new modules](#adding-new-modules)
- [Reporting bugs](#reporting-bugs)
- [Proposing features](#proposing-features)
- [Releasing](#releasing)

## Ways to contribute

- Report a bug or regression
- Propose or implement a new module (model provider, channel adapter, observer, persona, skill)
- Improve documentation, examples, or the dashboard UI
- Add tests or harden existing code
- Triage and review open issues and pull requests

## Development setup

```bash
# 1. Fork on GitHub, then clone your fork
git clone https://github.com/<your-user>/owlauto.git
cd owlauto

# 2. Install
npm install

# 3. Run the dashboard (auto-reloads on file save when used with a watcher)
npm run serve

# 4. Run the end-to-end demo
npm run demo
```

Requirements: Node.js >= 18, npm >= 9.

## Project structure

```
src/
├── core/         AgentRuntime, StateEngine, ToolRegistry
├── models/       ModelRouter + provider strategies
├── channels/     IChannelAdapter + adapters
├── observers/    Autonomous trigger sources
├── personas/     Persona strategies
├── skills/       Tool-mounting plugins
├── sandbox/      SandboxRunner (isolated execution)
├── server/       Localhost dashboard + REST API
├── utils/        Logger and shared helpers
└── index.ts      End-to-end demo entry point
```

See [README.md](./README.md#architecture) for the full architecture diagram.

## Branching model

- `main` is always shippable.
- Feature branches use the prefix `feat/`, e.g. `feat/redis-state-backend`.
- Fix branches use `fix/`, e.g. `fix/router-fallback-loop`.
- Documentation branches use `docs/`.
- Branch from the latest `main`. Rebase, do not merge, when keeping a PR up to date.

## Commit conventions

We follow [Conventional Commits](https://www.conventionalcommits.org/). The `type(scope): summary` format makes the changelog automatable.

Allowed types: `feat`, `fix`, `docs`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.

Examples:

```
feat(channels): add MS Teams adapter
fix(models): respect timeout when fallback chain triggers
docs(readme): clarify persona vs skill ownership
refactor(core): extract task lifecycle into TaskExecutor
```

Keep the subject line under 72 characters. Use the body to explain the *why*, not the *what*.

## Coding standards

- **TypeScript strict mode** is non-negotiable. The project compiles with `strict`, `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters`, and `noImplicitReturns`.
- Prefer **interfaces over type aliases** for public contracts.
- Prefer **`readonly`** properties on data carriers; mutate state through methods, not field assignment from outside.
- Prefer **enums** over string unions when a value is part of a public API surface (channel kinds, log levels, model vendors).
- Avoid default exports. Named exports keep refactoring honest.
- Do not introduce runtime dependencies lightly. Submit an issue first if a new package is required.
- Do not commit emojis in source files or commit messages.

### Naming

- Classes: `PascalCase` (`AgentRuntime`, `MarketWatcher`)
- Interfaces: `PascalCase`, prefixed with `I` only when there is a concrete class with the same root name (`IChannelAdapter` + `SlackChannel`)
- Files: match the primary export (`AgentRuntime.ts`)
- Folders: `kebab-case` for multi-word groupings, `lowercase` for single-word groupings (`personas/`, `models/providers/`)

### Logging

Use the shared `Logger` from `src/utils/logger`. Each module should construct its own scoped logger:

```ts
private readonly log = new Logger('MyModule');
```

Avoid `console.log` in non-test code; the dashboard ring buffer only captures `Logger` output.

## Testing your changes

Before opening a pull request:

```bash
npm run typecheck   # strict TypeScript check
npm run lint        # lint source
npm run demo        # end-to-end smoke test
npm run serve       # exercise the dashboard manually
```

If your change touches the dashboard, exercise the affected control function in the browser and confirm the activity log shows the expected events.

## Submitting a pull request

1. Open an issue first for non-trivial changes so we can align on scope.
2. Create a topic branch from `main`.
3. Make focused commits that follow Conventional Commits.
4. Update [CHANGELOG.md](./CHANGELOG.md) under `[Unreleased]`.
5. Update or add documentation when behaviour changes.
6. Push and open a pull request against `main` using the template.
7. Address review feedback by appending commits, then squash on merge.

Pull requests must:

- Pass `typecheck` and `lint`
- Include a clear description of the change and its motivation
- Link related issues (`Closes #123`)
- Keep diffs scoped — split large refactors from feature work

Maintainers will review within a reasonable timeframe. We may ask for changes, propose alternatives, or close PRs that fall outside the project's scope.

## Adding new modules

OwlAuto is intentionally extensible. Common extension points and their contracts:

| Extending | Implement | Register with |
|---|---|---|
| New LLM provider | `IModelProvider` | `ModelRouter.register()` |
| New messaging surface | `IChannelAdapter` | `ChannelRegistry.register()` |
| New trigger source | `IObserver` | `ObserverManager.register()` |
| New agent identity | `IPersona` | `PersonaRegistry.register()` |
| New capability bundle | `ISkill` | `SkillRegistry.register()` |
| New state backend | `IStateBackend` | Pass to `new StateEngine(backend)` |

Keep new modules in the matching folder under `src/`, add them to the folder's `index.ts` barrel export, and update the root `src/index.ts` if they are part of the public API surface.

## Reporting bugs

Use the [bug report issue template](.github/ISSUE_TEMPLATE/bug_report.md). Include:

- OwlAuto version and Node.js version
- Reproduction steps (smallest possible code sample)
- Expected vs actual behaviour
- Relevant log output

## Proposing features

Use the [feature request issue template](.github/ISSUE_TEMPLATE/feature_request.md). Describe the use case before the proposed implementation. Features that don't have a clear deployment story tend to stall in review.

## Releasing

Releases are cut by maintainers using semantic versioning:

- `MAJOR` — breaking changes to the public API surface (anything re-exported from `src/index.ts`)
- `MINOR` — new modules or non-breaking enhancements
- `PATCH` — bug fixes, documentation, internal refactors

The release process moves `[Unreleased]` entries in `CHANGELOG.md` under a new version heading, tags the commit, and pushes the tag.

---

Thanks for helping make OwlAuto better.
