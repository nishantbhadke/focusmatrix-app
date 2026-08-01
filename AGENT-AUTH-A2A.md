# Agent Authentication & Authorization for A2A — Learning Tracker

Personal learning project tracking progress on understanding agent identity, authentication, and authorization for Agent-to-Agent (A2A) communication. This file is the log a scheduled review checks against — it should be updated (not replaced) on each pass: append a dated status entry, tick off/adjust project state, and note new blockers or questions.

## Project status

| Field | Value |
|---|---|
| Stage | Just started — foundations/reading phase |
| In progress | Building the core concepts glossary below into working knowledge; no code yet |
| Blocked on | Nothing yet — no design questions raised so far |
| Next | Pick one item from "Daily habit tasks" each day; once glossary feels solid, build a toy RFC 8693 token-exchange flow (task #3) as the first hands-on artifact |

## Status log

- **2026-08-01** — Initialized this tracker. Researched the space end-to-end (concepts, current landscape, reading sources, habit tasks — see below). No prior state existed, so this run is the baseline. First suggested daily task: read one section of the MCP authorization spec and rewrite it in your own words (task #1 below).

## Core concepts glossary

Terms to stay fluent in. Revisit this list periodically — check off ones that feel solid, expand ones that don't.

- **A2A (Agent2Agent) Protocol** — Google's open protocol (Apache-2.0, Linux Foundation-governed) for agent discovery and communication over HTTP/JSON-RPC/SSE. This is the "how do two independent agents talk" layer, distinct from MCP's "how does an agent talk to a tool" layer. Reached v1.0 (stable) April 2026.
- **Agent Card** — A JSON manifest an A2A agent publishes describing its capabilities, skills, and auth requirements — a machine-readable business card fetched by other agents before interacting. As of A2A v1.0, cards can be cryptographically signed so a receiver can verify the issuer really owns the domain (prevents spoofed agent listings).
- **MCP Authorization Spec** — Anthropic's spec for connecting LLMs/agents to tools/data. The 2026-07-28 revision makes MCP servers formal OAuth 2.1 resource servers: mandatory Protected Resource Metadata (RFC 9728) for discovery and Resource Indicators (RFC 8707) so tokens are bound to one server (stops token replay across servers).
- **OAuth 2.1 for Agents** — Consolidates OAuth 2.0 best practices (mandatory PKCE, no implicit grant, no bearer tokens in URLs); becoming the baseline auth layer for MCP and agent tooling generally, since agents behave like public/native OAuth clients.
- **Token Exchange (RFC 8693)** — OAuth extension letting one service trade a token it holds for a narrower-scoped token to call a downstream service. The core mechanical building block for "agent acts on behalf of a user" flows.
- **On-Behalf-Of (OBO) Delegation / `act` claim** — Combines RFC 8693 with JWT Bearer assertions (RFC 7523) so a token's `sub` stays the human user while an `act` claim nests the agent's identity — preserving "who really authorized this" through multi-hop agent chains.
- **OAuth Identity & Authorization Chaining** (IETF `draft-ietf-oauth-identity-chaining`) — Profile of RFC 8693 + RFC 7523 for propagating identity/authorization across trust domains (multi-cloud, SaaS, agent-to-agent). Active through 2026.
- **Agent Identity vs. User Identity** — An AI agent needs its own first-class, auditable identity (not a shared service account or impersonated human session) so actions can be attributed, scoped, and revoked independently. Microsoft Entra Agent ID and Google's Agent Identity service are productizing this in 2026.
- **Non-Human Identity (NHI)** — Broader category (service accounts, API keys, bots, agents) that agent identity sits inside; its own security discipline because static, long-lived machine credentials are now the dominant breach vector.
- **Verifiable Credentials (VCs) for Agents** — W3C-standard cryptographically signed claims (e.g. "this agent is operated by Org X, authorized for scope Y") proving facts about an agent without a live lookup — used for cross-org trust.
- **Trust Registry** — A directory (often DID-based, e.g. emerging `did:trail` method) letting a verifier check whether an agent credential's issuer is legitimate before trusting a VC.
- **SPIFFE/SPIRE Workload Identity** — CNCF-graduated system issuing short-lived, auto-rotated cryptographic identities (SPIFFE IDs / SVIDs) to workloads instead of static secrets. Increasingly the base identity layer under agent identity (Google's Agent Identity builds on it) — answers "who is this process," while authorization frameworks answer "what can it do."
- **mTLS Between Agents** — Mutual TLS where both sides present certificates, giving cryptographic proof of identity at the transport layer; often paired with SPIFFE-issued certs.
- **Capability Tokens** — Tokens encoding a specific permission bundle ("what this bearer is allowed to do right now," not just who they are) — narrow, task-specific authority instead of broad standing access.
- **Scoped Permissions / Fine-Grained Authorization (FGA)** — Granting the minimum, task-specific set of actions/resources rather than role-wide access. Emerging consensus: authentication for agents is largely solved; fine-grained authorization is "still your problem."
- **AuthZEN** — OpenID Foundation working group standardizing a common authorization-decision API (PDP/PEP separation). 2026 drafts specific to agents: **AARP** (Access Request and Approval Profile, prerequisite-gated agent actions) and **COAZ** (AuthZEN Profile for MCP Tool Authorization).
- **Cross App Access (XAA)** — Okta/Auth0's open OAuth extension letting an IdP broker agent-to-app and app-to-app connections with policy-driven approval instead of long-lived API keys. Broader availability rolling out mid-to-late 2026.
- **Zero-Trust for Agentic Systems** — "Never trust, always verify, least privilege, assume breach" applied to agents specifically: continuous re-authorization per action rather than one-time login, since an agent's next action is unpredictable and blast radius compounds across a delegation chain.

## Current landscape snapshot (as of Aug 2026)

- **A2A v1.0** shipped ~April 2026: signed Agent Cards, new Agent Payments Protocol (AP2), GA in Microsoft Copilot Studio, Azure AI Foundry, Amazon Bedrock AgentCore. 150+ supporting orgs (Linux Foundation). — [Rapid Claw guide](https://rapidclaw.dev/blog/a2a-protocol-complete-guide-2026), [Google Developers Blog](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/), [GitHub a2aproject/A2A](https://github.com/a2aproject/A2A)
- **MCP 2026-07-28 spec** — largest revision since launch: formal OAuth 2.1 resource servers, mandatory Protected Resource Metadata + Resource Indicators, `iss` validation (RFC 9207) closing authorization-server mix-up attacks. — [MCP blog RC](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/), [WorkOS explainer](https://workos.com/blog/mcp-2026-spec-agent-authentication), [spec text](https://modelcontextprotocol.io/specification/draft/basic/authorization)
- **OpenID AuthZEN** won EIC 2026's Outstanding Project award; shipped AARP and COAZ drafts in 2026. — [OpenID news](https://openid.net/openid-foundation-advances-authorization-for-the-agent-era-with-new-authzen-working-group-drafts/), [Identiverse coverage](https://openid.net/authzen-at-identiverse-2026-authorization-in-the-agent-era/)
- **Microsoft Entra Agent ID / Agent 365** — GA May 1, 2026: every agent gets its own service-principal object ID, "Agent Identity Blueprints" as reusable permission templates, Conditional Access + Purview integration. — [Microsoft Learn](https://learn.microsoft.com/en-us/entra/agent-id/what-are-agent-identities), [Tech Community](https://techcommunity.microsoft.com/blog/microsoft-entra-blog/build-ai-agents-for-production-with-secure-identities-from-day-one/4524606)
- **Google Agent Identity** — built on SPIFFE, targets traceability/auditability of autonomous agents. — [writeup](https://medium.com/google-cloud/spiffe-why-googles-new-agent-identity-is-the-future-of-ai-security-240b4a94c66f)
- **Okta/Auth0 Cross App Access (XAA)** — early access Jan 2026, Auth0 dev early access end of July 2026, Okta workforce OIN rollout starting Aug 2026. — [Okta newsroom](https://www.okta.com/newsroom/press-releases/okta-introduces-cross-app-access-to-help-secure-ai-agents-in-the/), [SiliconANGLE](https://siliconangle.com/2025/09/25/okta-expands-identity-fabric-ai-agent-lifecycle-security-cross-app-access-verifiable-credentials/)
- **IETF drafts in motion**: `draft-ietf-oauth-identity-chaining` and `draft-klrc-aiagent-auth-00`, both active through 2026. — [chaining draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-identity-chaining/), [aiagent-auth draft](https://datatracker.ietf.org/doc/html/draft-klrc-aiagent-auth-00)
- **NIST NCCoE** — Feb 2026 concept paper, "Accelerating the Adoption of Software and AI Agent Identity and Authorization." — [PDF](https://www.nccoe.nist.gov/sites/default/files/2026-02/accelerating-the-adoption-of-software-and-ai-agent-identity-and-authorization-concept-paper.pdf)
- **WorkOS auth.md** — open, OAuth-based protocol proposal for agents to self-register with web services using scoped, auditable credentials (May 2026). — [MarkTechPost](https://www.marktechpost.com/2026/05/25/workos-releases-auth-md-an-open-agent-registration-protocol-built-on-oauth-standards/)
- **Descope Agentic Identity Hub 2.0**, CyberArk/Accenture partnerships — productizing agent-as-first-class-identity with OAuth 2.1 + tool-level scopes. — [Help Net Security](https://www.helpnetsecurity.com/2026/01/27/descope-agentic-identity-hub-2-0/)
- **Risk signal**: early-2026 research found 1,800+ public MCP servers with *no* authentication at all — standards are ahead of real-world adoption. (cited in Agentic Security Newsletter, below)

## Reading sources (rotate for daily/blog habit)

- [WorkOS Blog](https://workos.com/blog) — frequent, technically deep posts on OAuth/MCP/A2A auth patterns.
- [Descope Blog](https://www.descope.com/blog) — vendor blog, substantive MCP auth spec deep-dives and agentic identity infra.
- [The Agentic Security Newsletter (Substack)](https://agenticsecurity.substack.com) — weekly, directly on agent security incl. auth/identity.
- [Non-Human Identity Management Group (NHIMG) Newsletter](https://nhimg.org/newsletter) — weekly, NHI/agentic-identity research and breach analysis.
- [Ken Huang's Substack](https://kenhuangus.substack.com) — recurring deep pieces on agentic AI identity management.
- [Model Context Protocol Blog](https://blog.modelcontextprotocol.io) — primary source for MCP spec changes including auth.
- [OpenID Foundation News](https://openid.net/news/) / [AuthZEN WG](https://openid.net/wg/authzen/) — primary source for AuthZEN drafts.
- [A2A Project (GitHub)](https://github.com/a2aproject/A2A) — spec changes and design discussions happen in the open.
- [Microsoft Entra blog](https://techcommunity.microsoft.com/category/microsoft-entra/blog) — Agent ID/Agent 365 updates.
- DEV Community — search "kanywst dev.to" for worked-example explainers on RFC 8693, identity chaining, AuthZEN.
- Reddit: no dedicated subreddit exists for this niche yet. r/cybersecurity, r/identitymanagement, r/AI_Agents surface relevant threads occasionally — treat as supplementary, not primary.

## Daily habit tasks (rotate one per day, 15–30 min)

1. Read one section of the MCP authorization spec and rewrite it in your own words.
2. Read one A2A GitHub spec/issue thread; note what changed and why.
3. Implement a toy RFC 8693 token-exchange flow locally (mock AS + two "services").
4. Diagram the A2A handshake (Agent Card fetch → capability negotiation → signed request).
5. Read one WorkOS or Descope blog post; write 3 takeaway bullets.
6. Pick one IETF draft (identity-chaining or aiagent-auth); summarize its abstract + one open mailing-list issue.
7. Compare two vendor approaches (Entra Agent ID vs. Okta XAA vs. Descope Agentic Identity Hub) on one axis (token lifetime, revocation, scoping).
8. Build/extend a minimal OAuth 2.1 + PKCE client against a test MCP server.
9. Read the week's Agentic Security or NHIMG newsletter issue; log one new term or threat pattern.
10. Write a short "attack scenario" exercise: pick one concept (e.g. delegation chain splicing, unsigned agent card spoofing) and describe how you'd defend against it.
11. Skim one arXiv paper on agent protocol security (search "A2A MCP security 2026"); note its threat model.

## Blockers / open design questions

None yet — this is the initial baseline entry. Future runs should append here when a real blocker or design decision surfaces (e.g. "which token exchange library to prototype with," "unclear how to model multi-hop delegation in a toy project").
