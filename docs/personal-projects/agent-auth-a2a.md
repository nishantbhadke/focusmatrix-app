# Personal Project Tracker: Agent Authentication & Authorization for A2A

This is a running log for a personal learning + build project on **agent
authentication and authorization for agent-to-agent (A2A) communication**.
It is unrelated to the FocusMatrix product — it lives in this repo as the
owner's personal working notebook and is updated on each check-in.

Background fit: the owner is a backend engineer (.NET/C#, REST APIs, SQL
Server, Docker/AWS) who already understands classic API auth. The fastest
on-ramp into this space is OAuth 2.1 → MCP authorization spec → A2A/agent
identity, in that order, since each layer builds on the last.

## Status

| Track | State | Notes |
|---|---|---|
| Concept map (glossary below) | In progress | Seeded 2026-09-06, add terms as they come up |
| Reading habit | In progress | First suggestion logged below |
| Build project (hands-on) | Not started | No repo/design chosen yet — see "Next" |

**Blocked on:** nothing yet — the open item is a decision, not a blocker:
pick a concrete build target (see Design questions).

**Next:**
- Decide the build target for the hands-on project (see Design questions)
- Stand up a minimal OAuth 2.1 resource server as the first milestone once decided

## Design questions (need the owner's decision, not answerable by research alone)

1. **Build target** — three candidate shapes for the hands-on project, ranked by fit with a .NET background:
   - A minimal MCP server in ASP.NET Core that implements the OAuth 2.1 +
     PKCE + Protected Resource Metadata (RFC 9728) flow from the 2026-07-28
     MCP spec — most directly reuses existing REST API skills.
   - A toy two-agent A2A demo (two small services that discover each other
     via an Agent Card and delegate a task) — better for understanding A2A
     specifically, less overlap with prior experience.
   - A "verify a delegated agent token" library/middleware — narrower,
     good if the goal is a portfolio-sized artifact rather than a full system.
2. Is the goal a portfolio project (something to show/ship) or pure
   understanding? Changes how much time to spend on plumbing vs. reading.

## Concept map — things to stay "in the loop" on

Core building blocks, roughly in the order they compose:

- **Machine/service identity basics**: API keys vs. OAuth client
  credentials vs. mTLS vs. SPIFFE/SPIRE (workload identity) — the
  pre-agent foundation this all sits on.
- **OAuth 2.1 + PKCE**: now the base layer for agent auth; MCP servers are
  formally OAuth 2.1 resource servers as of the 2026-07-28 spec revision.
- **RFC 9728 (Protected Resource Metadata)**: lets a client discover which
  authorization server protects a given MCP/agent server.
- **RFC 8707 (Resource Indicators)**: client states which server a token is
  *for*, closing the "token meant for server A used against server B" hole.
- **Delegation vs. impersonation**: does the agent act *as* the user
  (impersonation) or *on behalf of* the user with its own identity
  (delegation, via token exchange, e.g. RFC 8693)? This distinction is the
  crux of most agent-auth design decisions.
- **Cross App Access**: vendor-neutral pattern for letting a user's
  identity follow an agent as it hops between applications/tools.
- **Non-human identity (NHI) / agent identity**: treating an agent as a
  first-class identity with its own lifecycle (provisioning,
  credentials, revocation), distinct from both "service account" and
  "the user who launched it."
- **Decentralized Identifiers (DIDs) / verifiable credentials**: the
  longer-horizon approach for agent identity that doesn't depend on a
  single central issuer — relevant once agents cross organizational
  boundaries.
- **A2A protocol specifics**: Agent Cards (capability/identity discovery),
  task delegation, and the fact that A2A intentionally does *not* define
  its own authorization framework — it defers to the implementer, which is
  exactly where the design questions above come from.
- **Sequence-level vs. request-level authorization**: OAuth validates one
  request; an agent executes a *sequence* of actions, and the real risk
  surface is in that sequence (excess scope accumulated over many calls),
  not any single call.

## Reading log

### 2026-09-06
- **Suggested read**: [Agent Identity, Authorization, and Encrypted
  Communication](https://gaoweichang.substack.com/p/agent-identity-authorization-and)
  (Substack) — direct hit on this exact topic, good primer-to-intermediate
  level.
- Also worth a look when going deeper on the standards side:
  - [WorkOS — The biggest MCP spec update ships July 28: what changes for
    AI agent authentication](https://workos.com/blog/mcp-2026-spec-agent-authentication)
  - [Descope — Diving Into the MCP Authorization
    Specification](https://www.descope.com/blog/post/mcp-auth-spec)
  - [NIST NCCoE — Accelerating the Adoption of Software and AI Agent
    Identity and Authorization (concept paper, Feb 2026 PDF)](https://www.nccoe.nist.gov/sites/default/files/2026-02/accelerating-the-adoption-of-software-and-ai-agent-identity-and-authorization-concept-paper.pdf)
    — heavier, but this is the standards-body framing if the project ever
    needs to speak to "why does this matter" for an employer.
  - [Google Developers Blog — Announcing the Agent2Agent Protocol
    (A2A)](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
    — the original announcement, useful for the protocol's own framing of
    the problem.

## Today's small task (habit-building, ~20-30 min)

Pick **one**:
- Read the Substack post above and write 3 bullet takeaways at the bottom
  of this file under a new `## Takeaways` heading.
- Skim the MCP 2026-07-28 authorization spec changelog and note, in one
  paragraph, what a client now has to do differently to talk to an MCP
  server (this seeds the first build milestone regardless of which build
  target gets picked).
- Answer design question #1 above (pick a build target) — this unblocks
  everything else in this tracker.

## How to use this file on future check-ins

- Append a new dated entry under **Reading log** each time with that day's
  suggested read + small task.
- Move rows in **Status** from Not started → In progress → Done as work
  lands; keep **Blocked on** honest — if nothing is blocked, say so.
- Resolve **Design questions** by editing them into decisions with a
  one-line rationale once the owner answers them, rather than deleting the
  history.
