# Agent Auth (A2A) Learning Log

A running daily log for the personal project on agent authentication and
authorization for Agent-to-Agent (A2A) communication. Each entry from the
daily scheduled review is appended at the top. Older entries stay below so
progress and repeated blockers are easy to spot over time.

Background this is tailored against: backend/.NET engineer (C#, ASP.NET
Core, EF, SQL Server, REST APIs, AWS/Docker), targeting SDE II / backend
roles at product companies. The angle throughout is "learn it by building
it" — using FocusMatrix's own backend as the sandbox for hands-on practice
rather than treating this as a purely theoretical reading track.

---

## 2026-07-22

### Concepts to stay in the loop on

Core vocabulary worth recognizing on sight, roughly ordered from
"table stakes" to "frontier":

- **Agent Card** — a machine-readable manifest an agent publishes describing
  its capabilities, input/output modes, and required auth scheme (used in
  Google's A2A protocol).
- **A2A protocol** — Google-led open spec (50+ industry partners) for
  cross-vendor agent interoperability. Explicitly punts credential
  provisioning out of scope: agents get an OAuth token or mTLS cert via an
  out-of-band flow, then pass it in the `Authorization` header.
- **MCP authorization (OAuth 2.1 + PKCE)** — Anthropic's Model Context
  Protocol now mandates OAuth 2.1 for MCP servers acting as resource
  servers: metadata discovery, dynamic client registration, PKCE-protected
  auth code flow, token lifecycle. This is the one most directly relevant
  to REST-API-and-.NET background — same shape as securing any resource
  server, just with an agent as the client.
- **Workload identity / SPIFFE + SPIRE** — cryptographic, non-human identity
  for a running process (an agent instance), independent of any human
  operator's credentials. The emerging 2026 consensus (HashiCorp, Palo Alto
  Networks, Anthropic's Zero Trust for AI Agents guide) leans toward SPIFFE
  identities for agents instead of long-lived API keys.
- **Delegation / on-behalf-of tokens** — when Agent A calls Agent B on
  behalf of a human or another agent, the token needs to carry *who
  authorized this* without granting Agent B the full original credential.
  OAuth token exchange (RFC 8693) and "transaction tokens" are the current
  building blocks.
- **DIDs / Verifiable Credentials** — decentralized identifiers and signed
  credential formats, mostly relevant for cross-organization agent trust
  where there's no shared identity provider.
- **Authorization is NOT solved by any of the above** — both A2A and MCP
  explicitly say "authentication is in scope, authorization is your
  problem." Scopes, RBAC/ABAC on what an agent can read/trigger, and audit
  logging are still bespoke per implementation. This is the gap most worth
  building real experience in, since it maps directly onto normal backend
  skills (claims, policies, scopes) rather than new agent-specific theory.

### What suits this project specifically

Given the .NET/backend background and the goal of product-company SDE
roles: skip the DID/verifiable-credential rabbit hole for now (interesting
but low leverage for a portfolio), and skip building a full custom A2A
stack from scratch. Highest-leverage path is OAuth 2.1 + scoped tokens +
audit logging, implemented on a real API — which FocusMatrix's own backend
already needs (see "Next Backend Steps" in `backend/README.md`: *"Add API
auth, rate limiting, and audit logging"*, *"Add multi-user auth and
user-scoped task storage"*). That backlog item is a ready-made vehicle for
this learning track instead of a synthetic tutorial project.

### Daily reading (today's picks)

- [MCP OAuth: How OAuth 2.1 Works in the Model Context Protocol](https://www.prefect.io/resources/mcp-oauth) — best single primer on the spec that's actually relevant to a REST-API background.
- [Is that allowed? Authentication and authorization in Model Context Protocol](https://stackoverflow.blog/2026/01/21/is-that-allowed-authentication-and-authorization-in-model-context-protocol/) — Stack Overflow blog, good on where MCP's auth model still has sharp edges.
- [Three Ways to Give an AI Agent an Identity — Kane Narraway](https://kanenarraway.com/posts/agent-identity-models/) — short, opinionated, compares API keys vs. OAuth vs. SPIFFE for agents.
- [SPIFFE: Securing the identity of agentic AI and non-human actors — HashiCorp blog](https://www.hashicorp.com/en/blog/spiffe-securing-the-identity-of-agentic-ai-and-non-human-actors) — workload identity, from the team that runs Vault/Boundary.
- [Managing Agent Sprawl and Identity Challenges in 2026 IT Environments — myITforum (Substack)](https://myitforum.substack.com/p/managing-agent-sprawl-and-identity) — the enterprise IAM/CISO-side view, useful for interview-level "why does this matter to a company" framing.
- Reddit: no single subreddit is dedicated to this yet — nothing dedicated on r/MachineLearning or r/cybersecurity beat the Substack/blog sources above today. Worth re-checking r/AI_Agents and r/mcp periodically rather than daily; will flag here if that changes.

### Today's small task (habit-builder, ~20–30 min)

Read the MCP authorization spec's "Authorization Flow" section
(https://modelcontextprotocol.io/specification/draft/basic/authorization)
and sketch — on paper or in a scratch file, not committed — what a minimal
OAuth 2.1 resource-server flow would look like bolted onto
`backend/src/server.js`. No code changes required today; the goal is just
naming the pieces (auth server, token endpoint, protected route
middleware) against a codebase already known well. Tomorrow's suggested
follow-up: implement a single protected route as a spike.

### FocusMatrix project status check

- Branch `claude/quirky-feynman-1gjwtq` is clean and in sync with `main` — nothing in progress, nothing blocked, no open issues or PRs.
- Last commits were portfolio-site work (portfolio-v2-command, resume docs), unrelated to the backend.
- No design questions currently blocking anything — the backlog is just unstarted, not stuck.
- Concrete next step when picked back up: `backend/README.md` → "Next Backend Steps" — add API auth (this is where the A2A/OAuth learning above plugs in directly), rate limiting, and audit logging; then multi-user auth and user-scoped task storage.
