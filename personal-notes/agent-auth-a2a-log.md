# Agent Auth & A2A — Learning Log

This is a personal learning/habit-tracking log for the "agent authentication and
authorization for Agent-to-Agent (A2A) communication" project. It is not part
of the FocusMatrix app — it's kept here because this is the one repo this
tracking routine has write access to. Each scheduled run appends a dated entry
below "Log history" instead of rewriting the whole file.

## Project status

- **Stage:** orientation / reading, no codebase yet.
- **In progress:** building the mental model (see checklist below) and a
  reading habit.
- **Blocked on:** nothing blocking. Open design question below.
- **Next:** once the checklist below feels solid, decide on a small hands-on
  demo (see "Open design question").

### Open design question

Build a toy demo in **.NET/C#** (matches your day-job stack: ASP.NET Core,
REST APIs, JWTs already used for maker-checker workflows) or in **Python**
(matches where most agent-protocol reference SDKs — A2A, MCP — actually ship
first)? No need to resolve this yet; flag it as a decision to make once the
concepts checklist below is comfortable, not before.

## Concepts to keep in the loop

A working mental-model checklist — the things you should be able to explain
before calling this topic "understood":

1. **Agent identity** — an agent needs an identity distinct from the human or
   service behind it (SPIFFE/SPIRE workload identity; A2A's signed "agent
   cards").
2. **Delegation chains** — how Agent A calls Agent B "on behalf of" user U
   without forwarding U's raw credentials (OAuth Token Exchange, RFC 8693).
3. **Three-layer authorization model** — (a) authentication: who is this
   agent, (b) API authorization: what endpoints/tools can it reach, (c)
   action authorization: should *this specific* tool call run right now,
   under policy.
4. **OAuth 2.1 + PKCE / client_credentials** — PKCE for anything
   browser/human-present, client_credentials for pure machine-to-machine
   hops, JWT bearer assertions to carry a delegation chain end-to-end.
5. **Resource indicators (RFC 8707)** — binding a token to the one resource
   it's meant for, so a leaked token can't be replayed against a different
   service.
6. **MCP's authorization spec** — OAuth-style protected resources +
   authorization-server discovery for MCP servers. Important nuance: MCP
   itself does **not** solve agent authorization by default — the auth spec
   is a separate layer bolted on top.
7. **A2A protocol specifics** — agent cards declare which auth schemes they
   support (OAuth2, OIDC, API keys, mTLS); actual credentials are always
   provisioned out-of-band, never embedded in the card itself.
8. **Composite emerging standards** — `draft-klrc-aiagent-auth-00` (AIMS)
   composes WIMSE + SPIFFE + OAuth2 rather than inventing a new protocol from
   scratch — a good signal for where the industry is converging.
9. **Multi-hop delegation problem** — what breaks when Agent A → Agent B →
   Agent C each need to prove the original human's intent, without trust
   silently accumulating or leaking at each hop.
10. **Governance / audit trail** — EU AI Act audit-trail requirements for
    high-risk systems move into broader enforcement in Aug 2026 — relevant
    the moment any agent project touches real user data.

## Reading queue (rotate through these, a couple per day)

Curated for your background (backend/.NET, REST APIs, BFSI compliance
workflows) — prioritizing practical/implementation pieces over pure theory:

1. **WorkOS — "AI agents and the multi-hop delegation problem"**
   https://workos.com/blog/oauth-multi-hop-delegation-ai-agents
   Best single article for *why* plain OAuth breaks once 2+ agents are in
   the call chain.
2. **Arcade.dev (dev.to) — "How to manage multi-user AI agent authentication
   and authorization in 2026 (OAuth 2.1, OIDC, and delegated access)"**
   https://dev.to/arcade/how-to-manage-multi-user-ai-agent-authentication-and-authorization-in-2026-oauth-21-oidc-and-2943
   Practical/implementation-oriented — closest to something prototypable
   against a REST API you already know how to build.
3. **kanywst (dev.to) — "ID-JAG, Transaction Tokens, WIF: The Three Layers of
   AI Agent Auth"**
   https://dev.to/kanywst/the-three-layers-of-ai-agent-authentication-what-id-jag-transaction-tokens-and-wif-actually-1mbk
   Short, good mental-model piece for concept #3 above.
4. **Google Developers Blog — "Announcing the Agent2Agent Protocol (A2A)"**
   https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
   Background/protocol-author framing, read once for context.
5. **kanywst (dev.to) — reading `draft-klrc-aiagent-auth-00`**
   https://dev.to/kanywst/ai-agent-authentication-authorization-deep-dive-reading-draft-klrc-aiagent-auth-00-5d1
   Deeper dive once 1–4 feel comfortable.

## Daily habit task

Small, ~20-30 min, one at a time:

- **2026-08-08:** Read the WorkOS multi-hop delegation article (link above).
  Then write 2-3 sentences in the next log entry answering: *"If FocusMatrix
  ever had an AI agent that read your calendar and wrote tasks back on your
  behalf, where would the delegation chain break first?"* — ties the
  abstract concept to something you already own and understand end-to-end.

## Log history

- **2026-08-08** — Log created. No prior tracking existed for this topic in
  this repo. Status: orientation stage, no code yet. Research above pulled
  from Google Developers Blog, WorkOS, Arcade.dev, dev.to, and Microsoft
  Learn. No blockers. Open design question noted above (build demo in .NET
  vs. Python) — deliberately deferred, not a blocker.
