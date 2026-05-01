import { Logger } from '../utils/logger';

export enum SandboxLanguage {
  JAVASCRIPT = 'javascript',
  PYTHON = 'python',
  SHELL = 'shell',
}

export interface SandboxJob {
  readonly language: SandboxLanguage;
  readonly code: string;
  readonly timeoutMs?: number;
  readonly env?: Readonly<Record<string, string>>;
  /** Allowlist of network hosts; empty array = no egress. */
  readonly allowedHosts?: ReadonlyArray<string>;
}

export interface SandboxResult {
  readonly stdout: string;
  readonly stderr: string;
  readonly exitCode: number;
  readonly durationMs: number;
}

/**
 * Conceptual sandbox interface. A production implementation would delegate
 * to one of:
 *   - Firecracker / gVisor microVMs
 *   - Docker with read-only FS, dropped caps, seccomp profile
 *   - V8 isolates (e.g. isolated-vm) for JS-only workloads
 *   - WASM runtimes (Wasmtime, WasmEdge) for portable sandboxing
 *
 * The mock impl below simply echoes job metadata so the runtime contract
 * can be wired and tested end-to-end.
 */
export class SandboxRunner {
  private readonly log = new Logger('SandboxRunner');

  async run(job: SandboxJob): Promise<SandboxResult> {
    const started = Date.now();
    this.log.info('sandbox job dispatched', {
      language: job.language,
      timeoutMs: job.timeoutMs ?? 5_000,
      egress: job.allowedHosts?.length ?? 0,
    });

    // Simulated execution. Swap for real isolation in production.
    await new Promise(r => setTimeout(r, 5));

    return {
      stdout: `[sandbox:${job.language}] executed ${job.code.length} bytes (mock)`,
      stderr: '',
      exitCode: 0,
      durationMs: Date.now() - started,
    };
  }
}
