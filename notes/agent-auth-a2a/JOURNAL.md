# Agent Auth & A2A — Personal Learning & Project Journal

This is a living notebook for a personal (non-FocusMatrix) side track: learning
and eventually building around **authentication and authorization for
agent-to-agent (A2A) communication** — OAuth/OIDC for non-human identities,
MCP authorization, Google's A2A protocol, and related delegation/trust models.

A recurring check-in updates this file: current status, blockers, a reading
suggestion, and a small daily task. If nothing changed since the last run,
the check-in just confirms that briefly instead of rewriting this file.

---

## Status snapshot

- **First entry:** 2026-07-20
- **Active build project:** none yet — see "Suggested starter project" below.
  Nothing to report as in-progress/blocked/next until a project is picked and
  scaffolded.
- **Blockers:** none yet (first run).
- **Next check-in should:** confirm whether the starter project was started;
  if yes, track its real progress/blockers here instead of the placeholder.

---

## Concepts to stay "in the loop" on

A working checklist — you don't need to master all of this before starting,
but these are the terms/ideas worth recognizing when they show up in a blog
post or spec:

- **Identity for non-human actors** — workload identity vs. user identity vs.
  *delegated* identity ("agent acting on behalf of user X").
- **OAuth 2.1 + PKCE** — current baseline flow for agent/tool auth; PKCE
  protects the token exchange but does not by itself authenticate *which*
  client is asking.
- **Client credentials grant & scoped tokens** — how an agent gets a
  short-lived, narrowly-scoped token instead of a long-lived API key.
- **OIDC vs. OAuth** — OAuth = delegated access ("can do X"), OIDC = identity
  ("who is this"). Agent systems often need both.
- **Dynamic Client Registration (DCR) → CIMD** — how agents register as
  OAuth clients on the fly; DCR wasn't built for how fast agent fleets churn,
  so newer proposals (CIMD) are emerging.
- **mTLS / PKI-backed machine identity** — closes the gap OAuth tokens alone
  leave open for agent-to-agent channels (both sides prove who they are at
  the transport layer).
- **Google's A2A protocol & Agent Cards** — a machine-readable capability +
  auth-scheme discovery document each agent publishes. Important nuance:
  **A2A explicitly does not define authentication or authorization itself**
  — it only lets an agent *advertise* what it needs; implementers own the
  actual credential and authz logic.
- **MCP Authorization spec** — OAuth-2.1-based access control for
  Model Context Protocol servers/tools.
- **Authorization models** — RBAC vs. ABAC vs. relationship-based (ReBAC)
  for answering "which agent can call which skill / read which data."
- **Delegation chains ("on-behalf-of" tokens)** — verifying trust across
  multiple hops (user → agent A → agent B → tool), not just one hop.
- **Agent Identity Protocol (AIP)** — an emerging proposal for verifiable
  delegation across MCP and A2A specifically.
- **Agent-specific threat models** — confused-deputy problems, prompt
  injection escalating into unauthorized tool calls, token leakage across
  chained tool calls.

## Why this maps onto your background

You've already built a lot of the underlying muscle for this at Winjit:
maker-checker approval workflows and REST API design for a BFSI compliance
system are the same shape as "which caller can trigger which action, and
who signed off" — just applied to human approvers instead of agents. OAuth
scopes ≈ the role gates in a maker-checker flow; delegation-chain
verification ≈ the audit trail requirements compliance systems already
demand. The gap to close is mostly vocabulary and the newer protocols
(A2A, MCP auth), not the underlying access-control thinking.

---

## Daily reading rotation

A rotating pool — pick one per day rather than trying to read everything:

**Substack**
- [The AI Engineer](https://theaiengineer.substack.com/) — agent stack layers, MCP, guardrails
- [The Nuanced Perspective](https://thenuancedperspective.substack.com/) — agent stack + MCP standardization
- [Coding with Roby](https://codingwithroby.substack.com/) — practical agent-stack breakdowns

**Vendor/engineering blogs**
- [Stytch — Agent-to-agent OAuth guide](https://stytch.com/blog/agent-to-agent-oauth-guide/)
- [Auth0 — MCP + Auth0](https://auth0.com/blog/mcp-and-auth0-an-agentic-match-made-in-heaven/)
- [Aembit — MCP, OAuth 2.1, PKCE, and the future of AI authorization](https://aembit.io/blog/mcp-oauth-2-1-pkce-and-the-future-of-ai-authorization/)
- [Cloudflare Agents docs — Authorization](https://developers.cloudflare.com/agents/model-context-protocol/authorization/)
- [SecureW2 — A2A Protocol Security](https://securew2.com/blog/a2a-protocol-security)
- [Galileo — Google's Agent2Agent (A2A) Protocol Explained](https://galileo.ai/blog/google-agent2agent-a2a-protocol-guide)

**Reddit**
- r/AI_Agents, r/mcp, r/LocalLLaMA (broader agent/infra threads), r/programming (general cross-pollination on API auth)

**Papers worth skimming (not full reads)**
- ["Governance Gaps in Agent Interoperability Protocols" (arXiv 2606.31498)](https://arxiv.org/pdf/2606.31498) — what MCP/A2A/ACP still don't express
- ["AIP: Agent Identity Protocol" (arXiv 2603.24775)](https://arxiv.org/pdf/2603.24775) — verifiable delegation across MCP and A2A

---

## Suggested starter project

**"Toy A2A Auth Gateway"** — small enough to build in a handful of 20–30
minute sessions, using the same Node.js stack already in `backend/` here:

1. Agent A registers with a tiny in-memory client registry (stand-in for
   DCR/CIMD).
2. Agent A requests a scoped, short-lived token from Agent B's "guard"
   service via an OAuth 2.1 client-credentials flow.
3. Agent B enforces scope + audience checks before executing the requested
   "skill" (a stub function is enough).
4. Add a JSON "Agent Card" describing each agent's capabilities and declared
   auth scheme, mirroring A2A's discovery pattern.

Goal isn't a production system — it's a hands-on feel for token scoping,
delegation, and capability discovery so the vocabulary above stops being
abstract.

---

## Daily task log

### 2026-07-20 (first run)
**Suggested task:** Read the [Stytch agent-to-agent OAuth guide](https://stytch.com/blog/agent-to-agent-oauth-guide/)
and the [A2A Protocol Security post](https://securew2.com/blog/a2a-protocol-security),
then write 2–3 sentences below on how an A2A "Agent Card" differs from a
normal OAuth client registration.
**Status:** suggested — not yet done (baseline entry, no prior check-in to
compare against).

---

## Blockers / open design questions

None yet — this is the first check-in. Once the starter project is actually
begun, log real blockers/design questions here (e.g., "which token format,"
"how to model delegation depth") so the next check-in can pick them up
instead of re-deriving context.
