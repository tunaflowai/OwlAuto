# Security Policy

The OwlAuto team takes security seriously. This document describes how to report a vulnerability, what is in scope, and what to expect after disclosure.

## Supported versions

We provide security fixes for the latest minor release on the `main` branch. Older releases are supported on a best-effort basis until the next major release.

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |
| < 0.1.0 | No        |

## Reporting a vulnerability

**Please do not report security issues through public GitHub issues, discussions, or pull requests.**

Instead, send a detailed report to:

- **Email:** `security@tunaflow.ai`
- **Subject:** `[OwlAuto Security] <short description>`

Or use GitHub's private vulnerability reporting:

1. Go to the repository's **Security** tab
2. Click **Report a vulnerability**
3. Fill in the form

### What to include

To help us triage the report quickly, please include:

- A description of the issue and the impact
- Steps to reproduce, or a proof-of-concept
- Affected versions or commit SHAs
- Any suggested mitigations
- Your name and contact information for follow-up (if you wish to be credited)

### What to expect

- **Acknowledgement:** within 3 business days of receipt
- **Initial assessment:** within 7 business days
- **Status updates:** at least every 14 days while the issue is open
- **Fix or mitigation:** as soon as practical, typically within 30 days for high-severity issues
- **Coordinated disclosure:** we will work with you on a public disclosure timeline

We will credit you in the release notes and `CHANGELOG.md` unless you request otherwise.

## Scope

In scope:

- The OwlAuto runtime (`src/core/`, `src/models/`, `src/channels/`, `src/observers/`, `src/personas/`, `src/skills/`)
- The localhost dashboard server (`src/server/`)
- The sandbox runner contract (`src/sandbox/`) and any first-party backends we ship
- Documented configuration knobs (environment variables, exported APIs)

Out of scope:

- Third-party dependencies (please report those upstream)
- Social engineering of contributors
- Denial-of-service via excessive request volume against your own deployment
- Issues in user-supplied personas, skills, or tool handlers

## Security best practices for users

OwlAuto is a framework. Production deployments are responsible for:

- **Authentication and authorization** in front of the dashboard server. The default `OwlAutoServer` does not authenticate requests.
- **Network exposure.** The dashboard binds to `localhost:3000` by default. Do not bind it to a public interface without an auth proxy.
- **API key storage.** Pass provider keys via environment variables or a secret manager; never commit them.
- **Tool safety.** Skills mount tools that the agent can invoke. Treat every registered tool as a potential attack surface and validate inputs.
- **Sandbox backends.** The shipped `SandboxRunner` is a stub. For production, plug in a real isolation backend (Firecracker, gVisor, V8 isolates, WASM).
- **Observer triggers.** Observers can autonomously emit tasks. Rate-limit external feeds and review the `intent`/`payload` schemas they produce.
- **Logging.** The Logger ring buffer is in-memory only. Forward logs to a managed pipeline before relying on them for incident response.

## Cryptographic considerations

OwlAuto does not currently ship cryptographic primitives. If we add any (signed task receipts, encrypted state, etc.) they will use Node's built-in `crypto` module and be documented here.

## Hall of fame

Security researchers who responsibly disclose issues will be listed here, with their permission.

_(No reports yet.)_

---

Thanks for helping keep OwlAuto and its users safe.
