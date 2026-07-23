# Personal Project Tracker — Agent Authentication & Authorization for A2A Communication

Learning + eventual build track for understanding and prototyping authentication/authorization
patterns for agent-to-agent (A2A) communication. This file is the running log a scheduled
check-in updates daily — status, glossary, reading, and small daily tasks.

## Status (as of 2026-07-23)

- **Stage:** research / learning — no code written yet.
- **In progress:** building vocabulary and a mental model of the protocol stack (MCP / A2A / ACP / AAP)
  before attempting a prototype.
- **Blocked on:** nothing external — next session should pick one concrete thread (see "Next steps") and go deeper.
- **Next:** implement a tiny proof-of-concept — an ASP.NET Core "agent" that authenticates to another
  ASP.NET Core "agent" using OAuth2 client-credentials + a scoped JWT, modeled after the AAP claims
  structure below. This maps directly onto skills already in the resume (REST APIs, JWT-style auth,
  maker-checker/delegation workflows from the BFSI compliance system).

## Why this topic fits (research notes)

Background: 4.5 years backend/.NET, REST API design, BFSI compliance workflows (maker-checker
approval chains), Docker/AWS deployment. Two angles line up well with that experience:

1. **OAuth2/OIDC extensions for agents** — the "Agent Authorization Profile" (AAP) extends OAuth2 +
   JWT with claims for agent identity, task binding, capabilities, delegation chains, and human
   oversight. The maker-checker approval pattern from the BFSI project is structurally the same
   problem as "delegation chain + oversight" in agent auth — good bridge for a portfolio project.
2. **Workload identity / zero trust** (SPIFFE/SPIRE-style short-lived cryptographic identity per
   agent instead of long-lived API keys) — pairs naturally with existing Docker/AWS containerized
   deployment experience.

Recommended entry point: don't start with the W3C standards-body threads (DID vs PKI debates) —
start from the OAuth2/JWT extension angle since it's the shortest path from current skills to a
working demo. Revisit the identity-layer (DID/SPIFFE) debates only once the OAuth2-based prototype works.

## Glossary — terms to stay in the loop on

| Term | What it means |
|---|---|
| **MCP** (Model Context Protocol) | Connects an agent to *tools* (Anthropic-originated). Has its own OAuth 2.1-based auth spec. |
| **A2A** (Agent2Agent Protocol) | Connects *agents to each other* (Google-originated, now Linux Foundation). Built on HTTP(S)/JSON-RPC/SSE. Auth via OAuth 2.0, OpenID Connect, API keys, or mutual TLS — declared per-agent in an "Agent Card." |
| **ACP** | Agent Communication Protocol — folded into A2A during 2025; mostly of historical interest now. |
| **UCP** | Emerging commerce/transaction lifecycle protocol layered on top of MCP/A2A. |
| **Agent Card** | A2A's discovery document — an agent publishes its capabilities and which auth schemes it supports. |
| **AAP** (Agent Authorization Profile) | Extends OAuth2 + JWT with structured claims for agent identity, task binding, capabilities, delegation chain, and oversight. |
| **RFC 8707 (Resource Indicators)** | MCP clients must use this to bind a token to the specific server it was issued for — prevents token replay against a different server. |
| **RFC 9728 (Protected Resource Metadata)** | MCP servers must expose this so clients can discover the correct auth server. |
| **NHI** (Non-Human Identity) | The IAM industry's umbrella term for service accounts, API keys, and now agents — the fastest-growing identity category CISOs are tracking in 2026. |
| **Workload identity / SPIFFE/SPIRE** | Short-lived, cryptographically verifiable identity issued to a workload (or agent) instead of a long-lived static API key. |
| **DID** (Decentralized Identifier) | An identity scheme some agent-auth proposals use instead of central PKI/pre-registration — actively debated in W3C's agent protocol community group. |
| **mTLS** | Mutual TLS — both sides present certificates; one of A2A's supported transport-level auth options. |
| **Delegation chain** | The record of "human → agent → sub-agent" authority hand-offs, so a downstream system can verify who ultimately authorized an action. |
| **On-behalf-of / token exchange** | OAuth2 flow (RFC 8693) for an agent to act with a narrower, derived token instead of the original user's full-privilege token. |

## Today's reading (2026-07-23)

1. **[MCP, A2A, and Where ACP Went](https://zuplo.com/blog/agent-protocol-stack-mcp-a2a-acp-2026)** — Zuplo.
   Best starting point: clear map of the current protocol stack and which piece solves which problem.
2. **[A2A Protocol Security: Authenticating Agent-to-Agent Communication](https://securew2.com/blog/a2a-protocol-security)** — SecureW2.
   Focused specifically on the auth schemes A2A supports (OAuth2, OIDC, API keys, mTLS) — most directly useful for the prototype.
3. **[Agentic AI Identity Management Approach](https://kenhuangus.substack.com/p/agentic-ai-identity-management-approach)** — Ken Huang (Substack).
   Zero-trust framing + an open-source SDK reference; good for the "next steps" identity-layer angle later.

Also worth a skim later (not urgent): [Inside Agent Auth: cryptographic identity per agent](https://medium.com/@pankaj_pandey/inside-agent-auth-the-protocol-that-gives-every-agent-its-own-cryptographic-identity-29052c721ebf) (Medium) and [Managing Agent Sprawl and Identity Challenges in 2026 IT Environments](https://myitforum.substack.com/p/managing-agent-sprawl-and-identity) (Substack) for the enterprise-IAM angle.

## Today's small task (2026-07-23)

Read the SecureW2 A2A auth article above (~10 min), then write 3–5 sentences (in this file, under
"Daily task log" below) sketching how you'd implement OAuth2 client-credentials + a scoped JWT for
two ASP.NET Core services acting as "agents" — reuse the JWT/REST patterns already used in the BFSI
project. No code yet — just the flow on paper.

## Daily task log

- **2026-07-23:** (routine created this tracker; today's task above is the first entry — fill in
  once done)

## Open questions / design decisions to resolve

- Which protocol to prototype against first: raw OAuth2 client-credentials (fastest to build,
  least "agent-native") vs. implementing an actual A2A Agent Card with declared auth schemes
  (more faithful to the emerging standard, more upfront reading required)?
- Where should the prototype live — a new standalone repo, or a `prototype/agent-auth/` folder
  here? (Leaning new repo, since this repo's scope is the FocusMatrix product.)
