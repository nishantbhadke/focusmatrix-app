# Personal Learning Project: Agent Auth & Agent-to-Agent (A2A) Communication

Tracker for a personal learning habit, not part of the FocusMatrix product. Lives here
so it gets versioned and checked on the same schedule as everything else.

## Status snapshot

- **In progress:** building the concept map (see checklist below) and a daily
  reading habit. No hands-on prototype started yet.
- **Blocked on:** nothing external — next step just needs 15-30 min/day.
- **Next:** pick one concrete hands-on exercise (see "First hands-on step") and
  actually run it, rather than staying in reading-only mode.

## Why this topic

Agent-to-agent (A2A) auth sits at the intersection of two things already in this
resume: backend API/auth work (.NET, REST, secure workflows at Winjit) and the
push toward AI-product roles. Every major identity vendor (Auth0, WorkOS,
Descope, Microsoft Entra) shipped an "agent identity" product in 2026, and
Google's A2A protocol (donated to the Linux Foundation, 150+ orgs backing it by
April 2026) is becoming the interop layer between agents the way REST/OpenAPI
did for services. The skill transfers directly: it's the same OAuth2/OIDC/mTLS
knowledge already used in BFSI work, applied to a new kind of "user" (an
autonomous agent instead of a human or a static service account).

## Concepts to keep "in the loop" (glossary, build this up over time)

| Concept | One-line meaning | Why it matters here |
|---|---|---|
| A2A protocol | Google/Linux Foundation open protocol (JSON-RPC 2.0 over HTTPS) for agents on different frameworks to discover and delegate tasks to each other | The emerging "REST for agents" — read the spec, not just takes on it |
| MCP (Model Context Protocol) | Anthropic's protocol for an agent calling tools/servers | Different problem from A2A: MCP = agent→tool, A2A = agent→agent |
| Agent Card | A signed manifest an agent publishes describing its identity/capabilities | Analogous to a service's OpenAPI doc + its TLS cert combined |
| Non-human identity (NHI) | Identity class for services/agents, distinct from human user accounts | Microsoft Entra Agent ID, IETF SCIM `/agents` resource are formalizing this in 2026 |
| Delegation / on-behalf-of token | A token that says "agent X is acting for user Y, with scope Z" | The actual hard problem — plain OAuth2 client-credentials doesn't express "on behalf of" cleanly |
| Capability token / scoped token | A token narrowed to exactly the actions an agent needs for one task | Contrast with a long-lived API key with broad scope |
| Invocation-Bound Capability Token (IBCT) | Research proposal chaining identity + attenuated authorization + provenance per call | Shows where the field is trying to go past plain OAuth |
| mTLS for agents | Mutual TLS so both sides of an agent-to-agent call verify each other | A2A leans on this because OAuth tokens alone don't prove *which* agent is calling |
| PKCE | Proof Key for Code Exchange, OAuth 2.1 extension | Now treated as mandatory baseline even for agent flows, not just public clients |
| Authorization vs authentication gap in A2A | A2A intentionally does NOT define an authorization framework — that's left to each implementation | The most commonly missed point — "A2A has auth" is only half true |

## Reading queue (rotate one per day, Substack/Reddit/vendor engineering blogs/arXiv)

Today's pick (2026-09-03):
- **[The developer's guide to AI agent authentication and authorization](https://workos.com/blog/developers-guide-to-ai-agent-authentication-and-authorization)** (WorkOS blog) — broadest, most practical starting point; frames agent auth against the OAuth/OIDC vocabulary already familiar from BFSI REST API work.

Queued for the following days, in order:
1. [AI Agents Are Not Users: Building an AI Agent Identity Model](https://auth0.com/blog/ai-agents-are-not-users/) (Auth0) — the core identity-model argument.
2. [Agent-to-agent OAuth: a guide for secure AI agent connectivity with MCP](https://stytch.com/blog/agent-to-agent-oauth-guide/) (Stytch) — OAuth applied specifically to MCP+A2A.
3. [A2A Protocol Security: Authenticating Agent-to-Agent Communication](https://securew2.com/blog/a2a-protocol-security) (SecureW2) — mTLS + signed agent cards deep dive.
4. [Announcing the Agent2Agent Protocol](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/) (Google Developers Blog) — primary source, read the spec claims directly.
5. [Descope vs Auth0 for AI Agent and MCP Authentication](https://www.descope.com/blog/post/descope-vs-auth0-ai-agent-mcp-auth) — a vendor comparison, useful for seeing where implementations actually diverge.
6. [Securing AI Agents: The Future of MCP Authentication & Authorization](https://cenrax.substack.com/p/securing-ai-agents-the-future-of) (Substack) — independent/practitioner take, less vendor-flavored.
7. [Leveraging PKCE in MCP servers authorization](https://kenhuangus.substack.com/p/leveraging-pkce-in-mcp-servers-authorization) (Substack) — implementation-level detail on the PKCE point above.

When this list runs out, search Reddit r/AI_Agents and r/mcp for "auth" threads, and re-run
a fresh WebSearch for that week — the field is moving fast enough that a static list goes stale in a few weeks.

## First hands-on step (once reading-only habit is steady)

Stand up a minimal MCP server locally (Node, since that's already in this repo's
backend stack) with no auth, then add OAuth2 + PKCE in front of it, and inspect
the token on each call. This turns the reading list into something testable
instead of purely conceptual — and it's a small enough scope to fit in a
side-project evening.

## Daily habit task

Keep it under 15-20 minutes so it's sustainable:
1. Read today's queued article (or skim + note if short on time).
2. Add/update one row in the glossary table above with a term from it.
3. Write one sentence in the Daily Log below connecting it to something already
   known from .NET/REST/BFSI auth work — that's what makes it stick.

**Today's task (2026-09-03):** Read the WorkOS guide above, then write one line
in the Daily Log answering: "how is calling an MCP/A2A endpoint as an agent
different from the client-credentials OAuth2 flows already built for BFSI
service-to-service calls?"

## Daily log

- **2026-09-03** — Tracker created. Did the research pass for the reading
  queue and concept glossary above (first run of this scheduled routine, so
  there was no prior state to check against). No blockers. Next scheduled run
  should append one line here after doing the daily task, and pull the next
  queued article to the top once today's is done.
