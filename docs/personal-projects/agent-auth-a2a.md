# Agent Authentication & Authorization for A2A — Learning & Project Tracker

Personal learning/project tracker for the "AI agent authentication & authorization,
Agent-to-Agent (A2A) communication" track. Updated by the daily automated review.
Tailored to a backend engineer (.NET Core / ASP.NET Core / REST APIs / SQL Server,
~4.5 yrs experience) moving toward product-company / platform engineering roles.

## How this file is used

- Each scheduled run checks this file for what changed since last time.
- "Status Log" at the bottom gets one new dated entry per run with real deltas.
- If nothing changed since the last entry, the run should say so briefly instead
  of padding this file with a duplicate entry.

---

## 1. Concept map — what to stay "in the loop" on

Core distinction: **Authentication** = proving who/what an agent is.
**Authorization** = deciding what that agent is allowed to do, on whose behalf.

Vocabulary to be fluent in (learn one at a time, don't try to swallow the field at once):

| Term | Why it matters |
|---|---|
| Non-human identity (NHI) | 2026 industry consensus: an agent is a first-class principal (cryptographically attested, short-lived), not a shared service account. |
| OAuth 2.1 + PKCE | The base access-delegation protocol almost every agent auth scheme (MCP, A2A extensions) now builds on. |
| Token Exchange (RFC 8693) | How a human's token gets swapped for a scoped agent token — the backbone of "on-behalf-of" delegation. |
| On-Behalf-Of (OBO) delegation | Agent acts as the user, with a delegation chain preserved end-to-end in the token. |
| DPoP (Demonstrating Proof-of-Possession) | Binds a token to a specific agent instance/key so a stolen bearer token can't be replayed elsewhere. |
| Resource Indicators (RFC 8707) | Client states exactly which resource server a token is for — closes token-confusion/mix-up attacks between multiple MCP/A2A servers. |
| CAEP (Continuous Access Evaluation Profile) | Real-time revocation — kill an agent's access mid-session instead of waiting for token expiry. |
| MCP as OAuth 2.1 Resource Server | Since the 2026-07-28 MCP spec, an MCP server is formally a resource server; MCP clients are OAuth clients. |
| A2A Agent Cards + JWS signing | A2A v1.0 (Mar 2026) requires cryptographically signed Agent Cards (RFC 7515 JWS + RFC 8785 JCS canonicalization) so agents can verify who they're talking to before delegating a task. |
| Delegation chain / scoped impersonation | Four dominant 2026 agent-identity models: user-delegated, autonomous (standing identity), hybrid-orchestrated (agent delegates to sub-agents), scoped impersonation. |
| Agent Card discovery | How an A2A agent advertises its capabilities/auth requirements to other agents before a task handoff. |

Standards bodies / drafts worth recognizing by name (don't need to read in full yet):
- IETF `draft-oauth-ai-agents-on-behalf-of-user`
- IETF `draft-yao-agent-auth-considerations`
- NIST AI Agent Standards Initiative (launched Feb 2026 — agent security/identity/authz/interop)
- A2A Project under Linux Foundation (donated by Google, 2025) — [github.com/a2aproject/A2A](https://github.com/a2aproject/A2A)
- Model Context Protocol spec — [modelcontextprotocol.io/specification](https://modelcontextprotocol.io/specification/draft/basic/authorization)

## 2. Reading sources to check regularly (Substack / Reddit / blogs)

Rotate through these rather than doom-scrolling all of them daily:

**Substack**
- [Ken Huang's Substack](https://kenhuangus.substack.com/) — agentic AI identity management, governance
- [Identosphere newsletter](https://newsletter.identosphere.net/) — decentralized/agent identity roundups
- [cenrax's Substack](https://cenrax.substack.com/) — MCP auth deep-dives

**Vendor/engineering blogs (high signal, practitioner-written)**
- [WorkOS blog](https://workos.com/blog) — MCP spec changes, agent auth explainers
- [Descope blog](https://www.descope.com/blog) — MCP auth spec walkthroughs
- [Aembit blog](https://aembit.io/blog) — non-human identity, workload auth
- [Cloudflare blog](https://blog.cloudflare.com/) — building AI agents with MCP authn/authz
- [Model Context Protocol blog](https://blog.modelcontextprotocol.io/) — primary source for spec changes
- [Stack Overflow blog](https://stackoverflow.blog/) — periodic MCP/agent-auth explainers for working devs

**Reddit / forums**
- r/AI_Agents, r/mcp, r/oauth — search rather than browse; signal-to-noise is low day-to-day
- IETF datatracker mailing list archives for the OAuth AI-agent drafts (skim thread subjects only)

**Primary sources (go here when a blog references a spec directly)**
- [A2A GitHub repo](https://github.com/a2aproject/A2A)
- [MCP Authorization spec](https://modelcontextprotocol.io/specification/draft/basic/authorization)

## 3. Small daily habit-building tasks (rotate, ~20–30 min each)

Pick one per day; don't try to do all of them. Goal is consistency, not volume.

1. **Read + note**: read one article from the list above, write 3 bullet takeaways in the Status Log.
2. **Build**: extend a tiny ASP.NET Core minimal API to act as an OAuth 2.1 *resource server* (validate a JWT access token, check an audience claim per RFC 8707) — this maps directly onto MCP's resource-server model and your existing .NET/REST background.
3. **Build**: write a minimal "Agent Card" JSON document by hand (per A2A spec) and verify it against the schema in the A2A GitHub repo.
4. **Read spec**: read one section of the MCP Authorization spec or the A2A protocol spec (not a blog summary) and translate it into your own one-paragraph explanation.
5. **Flashcard**: pick one term from the concept map above you're least confident on, explain it out loud/in writing without looking, then check yourself against this file.
6. **Compare**: pick two of {MCP, A2A, ACP, Agora} and write 3 sentences on how their auth models differ.

## 4. Project status

_No existing personal repo/codebase for this track has been found yet in scope. This
tracker currently lives in `focusmatrix-app` as the staging place for notes until a
dedicated project (e.g. a demo OAuth2.1 resource server or A2A agent-card exchange
sample) is started._

**In progress:** Building the concept map and reading list (this file).
**Blocked on:** Nothing blocking research; a hands-on demo project has not been started yet — needs a decision on stack (ASP.NET Core minimal API vs. Node) and whether it lives in this repo or a new one.
**Next:** Start habit task #2 (minimal OAuth 2.1 resource server) to get hands-on instead of reading-only.

**Open design questions:**
- Where should the hands-on demo project live — a new repo, or a subfolder here?
- Depth target: enough to speak fluently about agent auth in interviews, or enough to actually ship an MCP/A2A-compliant service?

## Status Log

### 2026-09-05 — Initial setup
- Created this tracker; researched current (2026) state of A2A + MCP authn/authz, OAuth 2.1 extensions for agents (Token Exchange, DPoP, Resource Indicators, CAEP), and the non-human-identity framing that the industry has converged on.
- Compiled reading source list and rotating daily-task list above, tailored to a .NET/backend background.
- No prior state existed for this track in this repo — nothing to diff against yet. Next run should report deltas against this entry.
