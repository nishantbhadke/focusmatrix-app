# Agent Auth / A2A Learning Journal

Personal learning + project tracker for "agent authentication and authorization
for Agent-to-Agent (A2A) communication." This is unrelated to the FocusMatrix
product itself — it lives in this repo because it's the durable, writable
place this assistant session has access to. Updated by the daily routine.

How this file is used each run:
1. Check "Project Tracker" below for state (in progress / blocked / next).
2. Add one row to "Reading Log" and one row to "Daily Task Log."
3. Tick off anything learned in "Concept Checklist."
4. If nothing changed since last run, the routine should say so briefly
   instead of padding this file.

---

## Concept Checklist

Core things to stay fluent in for this topic. Check off once you can explain
each one in your own words without looking it up.

- [ ] **A2A (Agent2Agent) protocol** — Google-led open protocol for agent
      interoperability. Agents publish signed "Agent Cards" describing their
      capabilities and supported auth schemes; A2A itself does not issue or
      verify credentials — that's delegated to OAuth/mTLS underneath.
- [ ] **MCP (Model Context Protocol) authorization spec** — OAuth 2.1-based
      flow for MCP clients calling MCP servers over HTTP. Covers metadata
      discovery, Dynamic Client Registration, PKCE, and Protected Resource
      Metadata (PRM). Authorization is optional in MCP but expected in
      production deployments.
- [ ] **Delegated vs. machine identity** — client-credentials grant (agent
      acting as itself, e.g. a background job) vs. a token delegated from a
      human's session (agent acting "on behalf of" a user). Different risk
      profile, different flow.
- [ ] **Non-human identity (NHI)** — the umbrella term for service accounts,
      bots, and agents. Roughly 80 NHIs exist per human identity in a modern
      org; agents are the fastest-growing and most ephemeral category.
- [ ] **SPIFFE / SPIRE** — workload identity framework. Each workload (agent)
      gets a short-lived cryptographic identity document (SVID) from a SPIRE
      server, used for mutual TLS between agents without shared secrets.
- [ ] **WIMSE** — IETF draft for workload-to-workload authentication, meant
      to compose with SPIFFE (identity) and OAuth (delegated authorization).
- [ ] **AIMS** — newer IETF draft (AWS/Zscaler/Ping/Defakto, ~March 2026)
      that stitches SPIFFE + WIMSE + OAuth together specifically for agent
      delegation chains (agent A asks on behalf of agent B on behalf of a
      human).
- [ ] **Confused deputy problem** — the classic risk this whole space exists
      to prevent: an agent with broad permissions gets tricked (often via
      prompt injection) into using them on behalf of an attacker.
- [ ] **Token Vault / token exchange (RFC 8693)** — pattern used by Auth0 for
      AI Agents and similar products so an agent never sees a user's raw
      long-lived credential, only scoped, short-lived exchanged tokens.
- [ ] **Enterprise vendor landscape** — Okta Cross App Access (XAA),
      Auth0 for AI Agents, Microsoft Entra Agent ID. All converging on
      OAuth 2.0/2.1 + MCP (tool access) + A2A (agent-to-agent) as the
      standard stack in 2026.
- [ ] **Agent card tampering / replay / impersonation** — A2A does not
      mandate how Agent Cards are verified as authentic; without signing
      and PKI-backed machine identity, a malicious agent can impersonate a
      trusted one.
- [ ] **Policy enforcement for agents** — applying RBAC/ABAC via a policy
      engine (e.g. OPA, Cedar) so "which agent can call which skill / read
      which data" is declarative and auditable, not hardcoded per-agent.

---

## Reading Log

| Date | Source | Title | Why it's worth reading |
|------|--------|-------|--------------------------|
| 2026-08-03 | Model Context Protocol (spec) | [Authorization](https://modelcontextprotocol.io/specification/draft/basic/authorization) | Primary source. Read this before any blog about it — it's short and it's the ground truth for the OAuth 2.1 flow MCP servers should implement. |
| 2026-08-03 | Descope (blog) | [Diving Into the MCP Authorization Specification](https://www.descope.com/blog/post/mcp-auth-spec) | Best plain-English walkthrough of the spec above, written for engineers who haven't implemented OAuth 2.1 + PKCE before. |
| 2026-08-03 | WorkOS (blog) | [MCP Authorization in 5 easy OAuth specs](https://workos.com/blog/mcp-authorization-in-5-easy-oauth-specs) | Maps each MCP auth requirement to the specific underlying RFC (PKCE, DCR, PRM, etc.) — good reference once the Descope post makes sense. |
| 2026-08-03 | Agentic Security Newsletter (Substack) | [agenticsecurity.substack.com](https://agenticsecurity.substack.com/) | Weekly, practitioner-run, covers zero-trust identity and governance toolkits for autonomous agents as they ship in enterprises — closest thing to a beat reporter for this exact topic. |
| 2026-08-03 | HashiCorp (blog) | [SPIFFE: Securing the identity of agentic AI and non-human actors](https://www.hashicorp.com/en/blog/spiffe-securing-the-identity-of-agentic-ai-and-non-human-actors) | Good bridge from "workload identity" (which overlaps with your Docker/AWS background) to "agent identity." |

Ongoing (lower priority, dip into when you want to go deeper):
- Reddit: r/AI_Agents, r/mcp, r/netsec — search "authorization" / "identity" for practitioner threads and war stories, not tutorials.
- arXiv: [AIP — Agent Identity Protocol for Verifiable Delegation Across MCP and A2A](https://arxiv.org/pdf/2603.24775), [Governance Gaps in Agent Interoperability Protocols (MCP, A2A, ACP)](https://arxiv.org/pdf/2606.31498) — academic, read once the practitioner material feels familiar, not before.
- dev.to: [MCP-I — a new identity standard for AI agents](https://dev.to/h0bb5/introducing-mcp-i-a-new-identity-standard-for-ai-agents-f1g), [Rethinking Authorization in the Age of AI Agents (Pomerium)](https://dev.to/pomerium/rethinking-authorization-in-the-age-of-ai-agents-110c)

---

## Why this fits you specifically

- The maker-checker approval workflows you built for BFSI loan disbursement
  at Winjit are structurally the same problem as "human-in-the-loop approval
  for high-risk agent actions" — you've already shipped the pattern this
  field keeps reinventing, just for humans instead of agents.
- Your REST API + Swagger/OpenAPI habits translate directly: MCP's
  authorization flow is "OAuth 2.1 over HTTP," which is squarely inside what
  ASP.NET Core already does well (JWT bearer middleware, `Microsoft.Identity`,
  or Duende IdentityServer for a local authorization server).
- Your Docker/AWS/CI-CD experience is exactly what's needed to stand up a
  toy SPIRE server and issue SVIDs to a couple of containerized "agents" —
  a natural weekend-sized project once the OAuth side feels solid.
- Suggested on-ramp, in order: (1) OAuth 2.1 client-credentials flow you
  already half-know from work → (2) MCP authorization spec, which is that
  same flow with agent-specific vocabulary → (3) SPIFFE/SPIRE for
  workload identity → (4) A2A Agent Cards and delegation chains, which is
  where most of the unresolved industry questions currently live.

---

## Project Tracker

_No existing agent-auth/A2A project was found in this repo (`focusmatrix-app`
is an unrelated productivity app) or anywhere else this session has access
to. This section is a placeholder until a real project exists._

| Project | Status | Next step | Blocked on |
|---------|--------|-----------|------------|
| Toy ASP.NET Core agent-to-agent OAuth demo | Not started (idea only) | Pick the stack (see design question below) | Decision below |

**Open design question:** which stack to prototype in first —
(a) ASP.NET Core + Duende IdentityServer (leverages existing .NET depth,
most direct path to a working demo), or (b) Python + FastMCP + Auth0 for AI
Agents (closer to what most public MCP tutorials use, easier to compare
notes against the community). Recommendation: start with (a) since it reuses
skills you already have and removes "learning a new backend stack" as a
variable while you're learning the auth concepts — revisit (b) later for
breadth.

---

## Daily Task Log

One small, ~20–30 minute task per day to build the habit. Keep it small
enough that skipping isn't tempting.

| Date | Task | Done? |
|------|------|-------|
| 2026-08-03 | Read the [MCP Authorization spec](https://modelcontextprotocol.io/specification/draft/basic/authorization)'s "Authorization Flow" section + the Descope walkthrough above. Write 3 bullets here (or in a follow-up) on how the client-credentials OAuth flow differs from the human-facing auth you already build at work. | Not yet |
