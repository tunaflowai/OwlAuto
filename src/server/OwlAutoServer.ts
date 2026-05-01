import * as http from 'http';
import { URL } from 'url';

import { AgentRuntime } from '../core/AgentRuntime';
import { AgentTask, TaskPriority } from '../core/types';
import { ChannelRegistry } from '../channels/ChannelRegistry';
import { PersonaRegistry } from '../personas/PersonaRegistry';
import { SkillRegistry } from '../skills/SkillRegistry';
import { ObserverManager } from '../observers/ObserverManager';
import { MarketWatcher } from '../observers/MarketWatcher';
import { Logger } from '../utils/logger';
import { OWL_FAVICON_SVG, OWL_LOGO_SVG } from './assets';
import { renderDashboardHTML } from './ui';
import { randomUUID } from 'crypto';
import { SandboxRunner, SandboxLanguage } from '../sandbox/SandboxRunner';

export interface OwlAutoServerDeps {
  readonly runtime: AgentRuntime;
  readonly channels: ChannelRegistry;
  readonly personas: PersonaRegistry;
  readonly skills: SkillRegistry;
  readonly observers: ObserverManager;
  readonly sandbox: SandboxRunner;
  readonly port?: number;
}

interface ServerStats {
  startedAt: Date;
  tasksExecuted: number;
}

/**
 * Lightweight zero-dep HTTP server exposing a control surface over the
 * OwlAuto runtime. Routes the dashboard UI plus a small REST API.
 */
export class OwlAutoServer {
  private readonly log = new Logger('OwlAutoServer');
  private readonly stats: ServerStats = { startedAt: new Date(), tasksExecuted: 0 };
  private server?: http.Server;
  private readonly port: number;

  constructor(private readonly deps: OwlAutoServerDeps) {
    this.port = deps.port ?? 3000;
  }

  async listen(): Promise<void> {
    this.server = http.createServer((req, res) => this.handle(req, res));
    await new Promise<void>(resolve => this.server!.listen(this.port, resolve));
    this.log.info('OwlAuto dashboard listening', { url: `http://localhost:${this.port}` });
  }

  async close(): Promise<void> {
    if (!this.server) return;
    await new Promise<void>(r => this.server!.close(() => r()));
  }

  private async handle(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    try {
      const url = new URL(req.url ?? '/', `http://localhost:${this.port}`);
      const route = `${req.method} ${url.pathname}`;

      // Static
      if (route === 'GET /')              return this.html(res, renderDashboardHTML());
      if (route === 'GET /favicon.svg')   return this.svg(res, OWL_FAVICON_SVG);
      if (route === 'GET /logo.svg')      return this.svg(res, OWL_LOGO_SVG);

      // API — read
      if (route === 'GET /api/status')    return this.json(res, this.statusPayload());
      if (route === 'GET /api/personas')  return this.json(res, this.personasPayload());
      if (route === 'GET /api/skills')    return this.json(res, this.skillsPayload());
      if (route === 'GET /api/channels')  return this.json(res, this.channelsPayload());
      if (route === 'GET /api/observers') return this.json(res, this.deps.observers.list());
      if (route === 'GET /api/tools')     return this.json(res, this.deps.runtime.toolRegistry.list().map(t => ({
        name: t.name, description: t.description,
      })));
      if (route === 'GET /api/logs') {
        const limit = Number(url.searchParams.get('limit') ?? 100);
        return this.json(res, Logger.recent(limit));
      }

      // State inspection
      const stateMatch = url.pathname.match(/^\/api\/state\/(.+)$/);
      if (req.method === 'GET' && stateMatch) {
        const sessionId = decodeURIComponent(stateMatch[1]);
        const snapshot = await this.deps.runtime.stateEngine.snapshot(sessionId);
        return this.json(res, { sessionId, snapshot });
      }

      // API — write
      if (req.method === 'POST') {
        const body = await this.readJson(req);

        const obs = url.pathname.match(/^\/api\/observers\/([^/]+)\/(start|stop)$/);
        if (obs) {
          const id = decodeURIComponent(obs[1]);
          if (obs[2] === 'start') await this.deps.observers.start(id);
          else                    await this.deps.observers.stop(id);
          return this.json(res, { ok: true, id, action: obs[2] });
        }

        if (url.pathname === '/api/observers/stop-all') {
          await this.deps.observers.stopAll();
          return this.json(res, { ok: true });
        }

        if (url.pathname === '/api/observers/market') {
          const watcher = new MarketWatcher({
            sessionId: 'session:dashboard',
            symbol: String(body.symbol ?? 'ETH-USD'),
            thresholdPct: Number(body.thresholdPct ?? 2.5),
            intervalMs: Number(body.intervalMs ?? 1000),
          });
          this.deps.observers.register(watcher);
          await this.deps.observers.start(watcher.id);
          return this.json(res, { ok: true, id: watcher.id });
        }

        if (url.pathname === '/api/tasks') {
          const result = await this.runManualTask(body);
          return this.json(res, result);
        }

        const send = url.pathname.match(/^\/api\/channels\/([^/]+)\/send$/);
        if (send) {
          const id = decodeURIComponent(send[1]);
          await this.deps.runtime.dispatch(id, String(body.recipient ?? ''), String(body.message ?? ''));
          return this.json(res, { ok: true });
        }

        // Sandbox execution
        if (url.pathname === '/api/sandbox') {
          const result = await this.deps.sandbox.run({
            language: (body.language as SandboxLanguage) ?? SandboxLanguage.JAVASCRIPT,
            code: String(body.code ?? ''),
            timeoutMs: body.timeoutMs ? Number(body.timeoutMs) : undefined,
            allowedHosts: Array.isArray(body.allowedHosts) ? body.allowedHosts as string[] : [],
          });
          return this.json(res, result);
        }
      }

      this.json(res, { error: 'Not found', route }, 404);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.log.error('request failed', { message });
      this.json(res, { error: message }, 500);
    }
  }

  // ── Helpers ────────────────────────────────────────────────────────────────

  private statusPayload() {
    return {
      uptimeSec: (Date.now() - this.stats.startedAt.getTime()) / 1000,
      tasksExecuted: this.stats.tasksExecuted,
      tools: this.deps.runtime.toolRegistry.list().map(t => t.name),
      channels: this.deps.channels.list().map(c => c.id),
    };
  }

  private personasPayload() {
    return this.deps.personas.list().map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      preferredModel: p.preferredModel,
      requiredSkillIds: p.requiredSkillIds,
    }));
  }

  private skillsPayload() {
    return this.deps.skills.list().map(s => ({ id: s.id, description: s.description }));
  }

  private channelsPayload() {
    return this.deps.channels.list().map(c => ({ id: c.id, kind: c.kind }));
  }

  private async runManualTask(body: Record<string, unknown>) {
    const persona = this.deps.personas.get(String(body.personaId));
    const skills = this.deps.skills.resolveAll(persona.requiredSkillIds);
    const task: AgentTask = {
      id: randomUUID(),
      sessionId: 'session:dashboard',
      source: 'dashboard:manual',
      intent: String(body.intent ?? 'ad_hoc'),
      payload: body.payload ?? {},
      priority: TaskPriority.NORMAL,
      createdAt: new Date(),
    };
    const result = await this.deps.runtime.execute(task, { persona, skills });
    this.stats.tasksExecuted += 1;
    return result;
  }

  private async readJson(req: http.IncomingMessage): Promise<Record<string, unknown>> {
    return await new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      req.on('data', (c: Buffer) => chunks.push(c));
      req.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        if (!raw) return resolve({});
        try { resolve(JSON.parse(raw)); } catch (e) { reject(e); }
      });
      req.on('error', reject);
    });
  }

  private html(res: http.ServerResponse, body: string): void {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(body);
  }
  private svg(res: http.ServerResponse, body: string): void {
    res.writeHead(200, { 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=86400' });
    res.end(body);
  }
  private json(res: http.ServerResponse, payload: unknown, status = 200): void {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(payload));
  }

  /** Hook the runtime to count completed tasks for the status card. */
  recordTaskCompletion(): void { this.stats.tasksExecuted += 1; }
}
