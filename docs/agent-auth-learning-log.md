# Agent Authentication & Authorization (A2A) — Learning Log

A running log for the personal project on agent authentication and
authorization for agent-to-agent (A2A) communication. This file is
updated by the daily automated review routine. Newest entry on top.

> Note: as of this entry, no code for an "agent auth" project exists in
> this repository (`focusmatrix-app` is a separate productivity/portfolio
> app). This log is the durable tracking surface for the *learning* side
> of the project until an actual implementation repo/folder is started.

---

## 2026-07-25

### Project status
- **In progress:** none yet — this is the kickoff entry for the learning log.
- **Blocked:** nothing blocked, but no implementation project has been
  scaffolded. There's no concrete "what am I building" decision yet
  (a demo A2A client/server pair? a token-exchange proxy? a policy engine?).
- **Next:** pick a concrete build target (see "small daily task" below)
  once the core vocabulary below feels solid — trying to build before the
  vocabulary is solid tends to produce cargo-culted OAuth flows that don't
  hold up.

### Open design questions (need your decision before code starts)
1. Are you building for a **specific framework** (MCP tool-calling agents,
   Google's A2A agent-to-agent delegation, or a custom multi-agent system),
   or is the goal protocol-agnostic understanding first?
2. Target trust model: same-org agents only (simpler — mTLS + workload
   identity may be enough), or cross-org/third-party agents (needs full
   OAuth2.1 + OIDC + agent cards + dynamic consent)?
3. Do you want to build the *authorization server* side, the *agent client*
   side, or both?

These three answers will determine which of the small daily tasks below
actually compound into something buildable, so they're worth resolving
early rather than defaulting into a random one.

### Things to stay "in the loop" on (core vocabulary)
Keep this list handy — these are the terms that keep recurring across A2A
security discussions, and not knowing one tends to make whole articles
opaque:

- **OAuth 2.0 / OAuth 2.1** — the base delegation-of-access protocol nearly
  everything below is built on top of.
- **OIDC (OpenID Connect)** — identity layer on top of OAuth; answers "who
  is this," not just "what can they do."
- **Token Exchange (RFC 8693)** — how one agent trades its token for a
  narrower-scoped token to call the *next* agent/service downstream.
- **Resource Indicators (RFC 8707)** — audience-binding a token to a
  specific resource so a stolen token can't be replayed elsewhere.
- **Delegation vs. impersonation** — delegation = "acting on behalf of,
  traceable back to the user"; impersonation = "acting as," identity is
  lost. Nearly every A2A security bug is a delegation model that quietly
  became impersonation.
- **Agent Cards** (Google A2A) — JSON-LD metadata an agent publishes
  describing its skills, endpoint, and supported auth schemes, so other
  agents can discover *how* to authenticate to it.
- **Workload Identity / WIMSE** (Workload Identity in Multi-System
  Environments) — IETF work on giving non-human workloads (agents,
  services) verifiable identity, not just API keys.
- **mTLS** — mutual TLS; common for locking down same-org agent-to-agent
  channels without a full OAuth dance.
- **Dynamic / just-in-time scope evaluation** — scopes decided per-call
  based on task context (prod vs. staging, data sensitivity, time of day)
  rather than a fixed scope grant at login.
- **MCP authorization spec** — Anthropic + Arcade/Microsoft/Okta-Auth0
  collaboration defining OAuth-style protected resources for MCP tool
  servers.
- **draft-klrc-aiagent-auth (IETF)** — the emerging standards-track draft
  trying to unify all of the above into one coherent framework for AI
  agent workloads.

### Today's reading suggestion
- ["An A2A Survival Guide for API Owners" — Bruno Pedro, *API Changelog* (Substack)](https://apichangelog.substack.com/p/an-a2a-survival-guide-for-api-owners)
  — good on-ramp: frames A2A from the API-owner's side (what you need to
  expose/trust), rather than the agent-builder's side, which is the angle
  most other posts take.
- Backup/deeper: [IETF draft-klrc-aiagent-auth](https://www.ietf.org/archive/id/draft-klrc-aiagent-auth-00.html)
  if you want the standards-track version instead of a blog take.
- Also worth a skim: [Christian Posta — "Configuring A2A OAuth User Delegation"](https://blog.christianposta.com/setting-up-a2a-oauth-user-delegation/)
  for a concrete walk-through of the delegation-vs-impersonation line above.

### Small daily task (habit-building, ~15–20 min)
Today: **write one paragraph** (in this file, appended below, or in your
notes app) answering open design question #1 above — framework-specific
vs. protocol-agnostic. That single decision unblocks tomorrow's task
(sketching an Agent Card / token-exchange flow on paper). No code needed
today, just the decision.

### Notes / answers to open questions
_(fill in here as you resolve the open design questions above — future
runs will read this section to know what's already decided)_

---
