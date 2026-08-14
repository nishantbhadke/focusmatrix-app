# Agent Authentication & Authorization (A2A) — Learning Journal

This is a personal learning tracker for the "agent authentication and
authorization for Agent-to-Agent communication" topic. It is not part of
the FocusMatrix product — it lives here because this is the only repo
this scheduled routine currently has access to. Each entry is one day's
check-in: a concept to internalize, a reading suggestion, and a small
task to build the habit.

> Note: there is no dedicated code project for this topic in this
> repository yet. If you want the routine to track an actual codebase
> (a prototype A2A client, an MCP auth demo, etc.), point it at that
> repo and this journal can move there. Until then, this file is the
> "project."

## Core concepts to stay in the loop on

Keep these terms straight — they come up constantly in this space and
get conflated a lot:

- **Agent identity / Non-Human Identity (NHI)** — every agent instance
  needs its own durable identity (not a shared API key), one that
  survives renames, redeploys, and ownership changes.
- **Delegated authorization** — an agent acting *on behalf of* a human
  or another agent, via OAuth 2.0 token exchange (RFC 8693) or
  on-behalf-of flows, rather than impersonating the user outright.
- **Agent Cards (A2A protocol)** — signed capability manifests that let
  one agent discover and verify what another agent can do before
  talking to it.
- **Workload identity / mTLS / PKI** — machine-to-machine identity
  (think SPIFFE/SPIRE) that authenticates the *agent process itself*,
  independent of any user session.
- **MCP Authorization spec** — MCP servers are now OAuth 2.1 resource
  servers; clients discover the authorization server via Protected
  Resource Metadata (RFC 9728) and bind tokens to a specific server via
  Resource Indicators (RFC 8707).
- **Scoped, short-lived credentials** — the opposite of a static API key
  baked into an agent's config; tokens should be narrow and expire fast.
- **Audit / attribution** — being able to answer "which agent, acting
  for which user, did this?" after the fact.
- **Zero Trust for agents** — continuous verification and least
  privilege applied to agents, not just humans.
- **Protocol landscape** — A2A (Google, now Linux Foundation, v1.0 in
  2026), MCP (Anthropic), and newer entrants like ACP and AGNTCY. A2A
  explicitly punts on *authorization* — it only defines transport-level
  authentication (OAuth/mTLS out of band). Authorization (who can call
  which skill) is left to each implementation.

## Why these matter for you specifically

Given you're a hands-on SDE building your own apps (FocusMatrix,
backend + Mongo + Swagger), the highest-leverage sources are
implementation-focused, not purely conceptual: official spec docs
(MCP authorization spec, A2A spec), vendor engineering blogs that show
real flows (WorkOS, Auth0, Okta), and Substack writers who ship code
alongside the explanation (e.g. ZazenCodes). Save the purely
philosophical "identity of AI" essays for when you want a break from
building — prioritize anything with a diagram or a code sample first.

---

## Daily entries

### 2026-08-14

**Reading suggestions:**
- ["Before You Trust an AI Agent, Give It an Identity"](https://agenticmesh.substack.com/p/before-you-trust-an-ai-agent-give) — Agentic Mesh (Substack). Why agents need a stable identity that outlives name/version/owner changes.
- ["The biggest MCP spec update ships July 28: what changes for AI agent authentication"](https://workos.com/blog/mcp-2026-spec-agent-authentication) — WorkOS. Concrete walkthrough of the 2026-07-28 MCP auth spec change (RFC 9728, RFC 8707, MCP servers as OAuth 2.1 resource servers).
- ["Securing Agent-to-Agent (A2A) Communication"](https://arnav.au/2026/07/16/securing-agent-to-agent-a2a-communication/) — practitioner writeup on where A2A's security model has gaps (mTLS, signed Agent Cards, PKI-backed identity).

**Today's small task (~15–20 min):** Read the WorkOS post above and write 3 bullet points in this file (below) in your own words: what changed in the MCP auth spec, and how it differs from how your FocusMatrix backend currently handles the local API key / no-auth setup.

**Your notes:** _(fill in after doing the task)_

**Status:** No blockers — this is the first entry. Open design question for later: decide whether to prototype an actual MCP-auth or A2A demo in a new repo, or keep this purely as reading/notes for now.

---
