# Learning Log: Agent Authentication & Authorization for A2A

Personal learning project, tracked as a daily habit alongside FocusMatrix. Focus
area: how AI agents authenticate to each other and get authorized to act — the
protocols, identity models, and open design questions in this space.

Each entry below is one day's check-in: concept spotlight, reading, a small
daily task, and status/blockers. Newest entry on top.

---

## 2026-08-24 — Day 1 (initial setup)

### Status

No prior entries exist for this project — this is the first check-in, so
there is nothing "in progress" or "blocked" yet from earlier sessions. Treat
today as the baseline. Nothing elsewhere in this repo relates to this topic
(FocusMatrix itself has no agent-auth component), so this log is the home
for it going forward.

### Concepts to keep in the loop

You already know REST APIs, OAuth-style service integrations, and secure
workflow systems (maker-checker, BFSI compliance) from your day job — that
maps directly onto this space. The vocabulary that's specific to *agentic*
auth and worth tracking as it evolves:

**Protocols (the "what talks to what")**
- **A2A (Agent2Agent)** — Google-originated, now Linux Foundation-governed
  (v1.0 shipped in 2026), protocol for agents to discover and call each
  other. Uses "Agent Cards" (like a service manifest) to advertise
  capabilities and which auth schemes are supported. Backed by Google,
  Microsoft, Salesforce, ServiceNow.
- **MCP (Model Context Protocol)** — Anthropic's protocol for an agent to
  call *tools/servers* (not other agents per se). As of the 2026-07-28 spec
  revision, MCP servers are formally OAuth 2.1 resource servers.
- **ACP** — a third interoperability protocol, referenced alongside A2A/MCP
  in current governance-gap research; worth knowing it exists, lower
  priority to go deep on yet.

**Auth building blocks (the "how it's secured")** — these are largely
standard OAuth/OIDC machinery being repurposed for agents, so your existing
mental model transfers:
- **OAuth 2.1** — the current baseline both MCP and most agent auth designs
  build on (PKCE mandatory, stricter redirect handling than 2.0).
- **RFC 9728 (Protected Resource Metadata)** — lets a client discover *which*
  authorization server to use, automatically. MCP servers must implement it.
- **RFC 8707 (Resource Indicators)** — a client states which specific server
  a token is meant for, so a malicious downstream server can't replay a
  token meant for someone else.
- **RFC 8693 (Token Exchange)** — how an agent trades one token for another
  when it needs to act "on behalf of" a user or another agent, without
  seeing the original credential.
- **IETF Transaction Tokens** — an emerging way to carry "on behalf of whom,
  with what permissions" across a whole call chain of agent hops.

**Identity (the "who is this agent, really")**
- **Workload identity / SPIFFE-SPIRE** — gives the *running process* a
  cryptographic identity anchored in platform attestation instead of a
  static secret. `draft-ietf-oauth-spiffe-client-auth` is the bridge from
  SPIFFE identities into standard OAuth client auth.
- **mTLS + PKI-backed machine identity** — closes gaps OAuth bearer tokens
  alone leave open (replay, impersonation).
- **Agentic identity / delegated authorization** — the general idea that an
  agent acting for a human needs its own identity *and* an auditable trail
  of who delegated what to it. Emerging proposals: **AAuth** (Dick Hardt),
  **AIP — Agent Identity Protocol** (verifiable delegation across MCP + A2A).

**Known open problems (good to recognize, not solved yet)**
- A2A defines *authentication* schemes via Agent Cards but explicitly does
  **not** define authorization — that's left to each implementation.
- Agent Card tampering, agent impersonation, and replay attacks are real,
  unsolved risk areas without added controls like signed cards.

### Today's reading

Picked for relevance to a backend/API-security background, not generic AI
news:

1. **[Diving Into the MCP Authorization Specification](https://www.descope.com/blog/post/mcp-auth-spec)** (Descope) — closest thing to precise API-security material; treat it like reading an RFC.
2. **[The biggest MCP spec update ships July 28: What changes for AI agent authentication](https://workos.com/blog/mcp-2026-spec-agent-authentication)** (WorkOS) — the 2026-07-28 spec revision, explained for engineers.
3. **[The Rise of Agentic Identities](https://permit.substack.com/p/the-rise-of-agentic-identities-who)** (Permit.io Substack) — the "who is this agent and what can it access" framing, less code, more mental model.
4. **[Before You Trust an AI Agent, Give It an Identity](https://agenticmesh.substack.com/p/before-you-trust-an-ai-agent-give)** (Agentic Mesh Substack) — practical take on onboarding agents through existing IAM.
5. **[A2A Protocol Security: Authenticating Agent-to-Agent Communication](https://securew2.com/blog/a2a-protocol-security)** — A2A-specific auth walkthrough.

Ongoing sources worth subscribing to / checking periodically rather than
one-off reads: **Identosphere newsletter** (identosphere.net) tracks the
identity-for-agents beat broadly; no single high-signal Reddit thread turned
up today, but **r/mcp** and **r/AI_Agents** are the right subreddits to
skim for practitioner discussion (search didn't surface a specific thread
worth linking today — will check again on a future pass).

### Small daily task (habit-builder)

Keep it to ~20–30 minutes, hands-on, building toward something real over
the week rather than passive reading:

**Today:** Stand up a minimal local OAuth 2.1 client-credentials flow (you
already know this shape from BFSI service integrations) and write down, in
one paragraph, how it would need to change for one agent to call another
agent's tool *on behalf of* a specific end user — i.e., where does token
exchange (RFC 8693) fit into your existing mental model of service-to-
service auth?

### Open design questions / blockers for next check-in

- No blockers yet — this is day 1. First real design question to chase: if
  you build an agent-facing API for FocusMatrix later (e.g. an agent that
  logs tasks on a user's behalf), would you reach for plain OAuth 2.1
  client-credentials, or is Agent Card–style capability advertisement (A2A)
  worth adopting even for a single-agent use case? Revisit after a few more
  days of reading.
