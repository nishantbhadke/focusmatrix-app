# Agent Auth & A2A — Learning + Personal Project Track

A running log for a personal learning/project track on **agent authentication
and authorization for Agent-to-Agent (A2A) communication**. Updated by a daily
automated review. Unrelated to the FocusMatrix product — this repo is just
where personal tracking docs live.

## Why this topic

Agent-to-agent auth sits at the intersection of a few things worth building
real depth in: identity/auth systems (OAuth, mTLS, workload identity), the
emerging agentic-protocol space (MCP, A2A, ACP), and applied security
engineering. It's a good "personal project" topic because it's concrete
(protocols with real specs), moving fast (lots to read/build right now), and
has a natural project on the other end (e.g. building a small A2A-compliant
agent, or a demo identity broker for agent-to-agent calls).

## Concepts to stay "in the loop" on

Keep these on your radar — you don't need to master all of them at once, but
you should recognize the term and roughly where it fits:

- **AuthN vs AuthZ for agents** — authentication proves *which* agent/identity
  is calling; authorization decides *what* that identity is allowed to do.
  Agents blur this because the "actor" can be a human, a delegated agent, or
  an agent acting on behalf of another agent — the delegation chain matters.
- **OAuth 2.1 / OIDC for agents** — MCP's spec leans on OAuth 2.1. Know the
  client credentials grant (machine-to-machine, no human present) vs.
  delegated/on-behalf-of tokens (agent acting for a logged-in user).
- **Workload identity / SPIFFE-SPIRE** — short-lived, cryptographically
  verifiable identities (SVIDs) issued to workloads/agents instead of static
  API keys. This is becoming the "industry standard" answer to "how does an
  agent prove who it is" without hardcoded secrets.
- **Agent Cards (A2A)** — a public JSON document an agent publishes describing
  its capabilities, endpoint, and supported auth schemes. Analogous to an
  OpenAPI spec, but for agent discovery. Card tampering/impersonation is an
  open risk area since A2A doesn't mandate how cards are verified.
- **Delegation chains / task binding** — when Agent A calls Agent B on behalf
  of user or Agent C, something needs to carry "who ultimately authorized
  this" through the whole chain. Look at the "Agent Authorization Profile
  (AAP)" extending OAuth/JWT with delegation-chain + capability claims.
- **Scopes & least privilege** — short-lived, narrowly-scoped tokens per task
  rather than long-lived broad credentials. The recurring failure mode across
  every source is "agent gets a static, over-scoped credential."
- **Protocol landscape** — MCP (tool/context connection, client↔server),
  A2A (agent↔agent, peer-to-peer task exchange, Google-led, now Linux
  Foundation governed), ACP (another agent comms protocol). Know what each
  one is *for* so you're not conflating them.
- **Governance gaps** — current protocols (MCP/A2A/ACP) mostly punt on
  policy/oversight — they define message shape, not "should this agent be
  allowed to do this." That gap is where a lot of interesting project ideas
  live.

## Where to read (rotating source list)

- **Substack:** search/follow security-and-identity-focused newsletters —
  e.g. `myitforum.substack.com` (IT/identity ops angle), `neurlcreators.substack.com`
  (LLM agent security). Substack search for "agent identity" / "A2A protocol"
  surfaces new posts fast since this is an actively-written-about topic.
- **Reddit:** r/MachineLearning, r/LocalLLaMA, r/AI_Agents, and r/netsec for
  the security-practitioner take. Search "A2A protocol" or "agent auth"
  within those rather than browsing generally — signal is low otherwise.
- **Vendor/practitioner blogs worth checking periodically:** Google
  Developers Blog (A2A announcements/spec updates), Anthropic's MCP docs and
  blog (auth spec changes), Stacklok, Riptides, Palo Alto Networks Unit42 /
  Idira blog (SPIFFE-for-agents pieces), Auth0/Okta blogs (practical
  implementation guides).
- **Primary sources > blog takes:** the A2A spec repo, the MCP auth spec, and
  arXiv papers on agent identity (e.g. "AIP: Agent Identity Protocol",
  "Governance Gaps in Agent Interoperability Protocols") are worth reading
  directly when a topic gets interesting rather than only reading summaries.

## Project status

| Project | Status | Notes |
|---|---|---|
| Agent Auth / A2A learning track | **Research phase** | Just scaffolded (2026-08-20). No blockers yet — next step is picking a first small build target. |
| Candidate build: minimal A2A-compliant demo agent (agent card + OAuth client-credentials auth) | **Idea, not started** | Would be the first real "project" once the concept groundwork feels solid — probably 1-2 weeks out. |
| Candidate build: toy delegation-chain verifier (JWT + AAP-style claims) | **Idea, not started** | Good follow-on project once OAuth/JWT delegation concepts are comfortable. |

### Open design questions (none blocking yet)

- Which first project is more motivating to start: the demo A2A agent
  (protocol-shaped, more "plumbing") or the delegation-chain verifier
  (auth-shaped, more "crypto/claims")? Worth deciding once the concepts
  glossary above stops feeling new.

## Daily log

### 2026-08-20 — track scaffolded

- First run. Created this tracking doc since no prior project state existed.
- Researched current state of A2A + agent auth (see Concepts section above,
  populated from current sources on the A2A v1.0 spec, SPIFFE-for-agents
  adoption, and OAuth 2.1/MCP auth requirements).
- **Blog suggestion for today:**
  ["Bringing SPIFFE to OAuth for MCP: Secure Identity for Agentic Workloads"](https://blog.riptides.io/bringing-spiffe-to-oauth-for-mcp-secure-identity-for-agentic-workloads/)
  — good concrete read connecting workload identity to the MCP auth model.
  Backup pick: [Google's A2A announcement post](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
  if you want the protocol-origin story first.
- **Small daily task:** Read the "Agent Cards & Discovery" section of the A2A
  spec (or the Tyk A2A guide linked below) and write 3 sentences, in your own
  words, on what makes an Agent Card different from a normal API's OpenAPI
  doc. Keep it under 15 minutes — the goal is a small daily rep, not a deep
  dive.

Sources used today:
- [Announcing the Agent2Agent Protocol (A2A) — Google Developers Blog](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [A2A Protocol: The Definitive Agent-to-Agent Guide — Tyk](https://tyk.io/learning-center/a2a-protocol-architecture-and-technical-specification/)
- [A2A Protocol Security: Authenticating Agent-to-Agent Communication — SecureW2](https://securew2.com/blog/a2a-protocol-security)
- [Securing Agent-to-Agent (A2A) Communication](https://arnav.au/2026/07/16/securing-agent-to-agent-a2a-communication/)
- [Bringing SPIFFE to OAuth for MCP — Riptides](https://blog.riptides.io/bringing-spiffe-to-oauth-for-mcp-secure-identity-for-agentic-workloads/)
- [Agent Auth: Why OAuth Wasn't Built for This — Apideck](https://www.apideck.com/blog/agent-auth-oauth-ai-agents)
- [OAuth for AI Agents: A Practical Implementation Guide — SecureW2](https://securew2.com/blog/oauth-for-ai-agents)
- [Cryptographically Verifiable SPIFFE Identity — Palo Alto Networks](https://www.paloaltonetworks.com/blog/identity-security/ai-agent-security-spiffe-machine-identity/)
- [Managing Agent Sprawl and Identity Challenges in 2026 — MyITForum (Substack)](https://myitforum.substack.com/p/managing-agent-sprawl-and-identity)
- [How SPIFFE and Relationship-Based Auth Work for AI Agents — Stacklok](https://stacklok.com/blog/agentic-identity-explained-how-to-apply-spiffe-and-relationship-based-authorization-to-ai-agents-in-2026/)
- [How to Authenticate AI Agents: From Most Secure to Worst Practice — Entro Security](https://entro.security/blog/authentication-hierarchy-ai-agents/)
- [Securing LLM Agents: How AI Teams Prevent Unauthorized Access & Data Leaks — neurlcreators (Substack)](https://neurlcreators.substack.com/p/securing-llm-agents-authentication)

<!-- Next automated run: append a new dated entry above this line, update the
Project status table if anything moved, and note any new blockers/design
questions. Keep entries short — a few bullets and a link, not an essay. -->
