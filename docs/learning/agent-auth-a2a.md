# Learning Tracker: Agent Authentication & Authorization for A2A

Personal learning + project log for understanding and eventually building
agent-to-agent (A2A) authentication/authorization. Updated by a daily
scheduled check-in. Not part of the FocusMatrix product — this repo is just
where the notes and any prototype code live for now.

## Status (updated 2026-08-22)

- **In progress:** Day 1 — no code yet, this file. Concept map and reading
  list below are the starting point.
- **Blocked on:** nothing external; the open question is which concrete
  project to anchor the habit on (see "Next" below).
- **Next:** pick one small buildable target — e.g. a toy 2-agent demo where
  Agent A calls Agent B over HTTP, authenticates via OAuth 2.1 client
  credentials, and presents a signed "agent card" — then iterate on it daily
  instead of only reading.

---

## 1. The concept map — what to stay "in the loop" on

These are the pieces that keep coming up. Treat this as the syllabus; check
items off mentally as they stop feeling new.

| Concept | Why it matters | Keyword to search when confused |
|---|---|---|
| **A2A Protocol** (Linux Foundation, Google/Microsoft/Salesforce-backed, reached v1.0 in 2026) | The emerging standard for how independent agents discover each other and exchange tasks. Defines "agent cards" (capability + auth-scheme advertisement) but deliberately leaves authorization up to implementers. | "A2A protocol agent card" |
| **MCP Authorization spec** (2026-07-28 revision) | MCP servers are now formal OAuth 2.1 *resource servers*. Requires RFC 9728 (Protected Resource Metadata) for discovery and RFC 8707 (Resource Indicators) so a token can't be replayed against the wrong server. | "MCP OAuth 2.1 resource indicators" |
| **OAuth 2.1 client-credentials flow** | The default way one agent authenticates to another/to a tool server without a human in the loop. Table stakes — understand this before anything fancier. | "OAuth 2.1 client credentials grant" |
| **Workload identity (SPIFFE/SPIRE)** | Gives an agent a cryptographically verifiable identity tied to *what it is and where it runs*, instead of a long-lived API key. Google Cloud's new "Agent Identity" service is built on this. This is the piece most likely to replace static secrets. | "SPIFFE SPIRE agent identity" |
| **Delegation / verifiable credentials** | When Agent A acts *on behalf of* a human or another agent, how is that delegation proven and scoped? Relevant papers: "AIP: Agent Identity Protocol for Verifiable Delegation" (arXiv 2603.24775). | "agent delegation verifiable credential" |
| **mTLS + signed agent cards** | A2A's spec gap: it doesn't mandate how agent cards are verified, so impersonation/replay is a real risk without mTLS or card signing layered on top. | "mutual TLS agent card signing" |
| **Non-human identity (NHI) governance** | The broader security-industry framing for "how do we manage credentials for things that aren't people" — agents are the newest, fastest-growing category. | "non-human identity management" |

**Rule of thumb for the daily check-in:** if a new term shows up in a blog
post and it's not in the table above, that's the signal to add a row, not to
panic about being behind.

---

## 2. Reading sources worth following

**Blogs/newsletters (company + independent):**
- WorkOS blog — practitioner-level MCP/OAuth spec breakdowns
- Descope blog — "Diving into the MCP Authorization Specification"
- Aembit blog — MCP, OAuth 2.1, PKCE
- Stacklok blog — SPIFFE + relationship-based auth for agents
- MojoAuth blog — SPIFFE/SPIRE vs OAuth client credentials, agent-focused
- Riptides blog — SPIFFE meets OAuth2, landscape pieces
- Palo Alto Networks (Idira) blog — cryptographic workload identity for agents
- Tyk learning center — A2A protocol architecture deep dives
- SecureW2 blog — A2A protocol security
- [cenrax on Substack](https://cenrax.substack.com/p/securing-ai-agents-the-future-of) — "Securing AI Agents: The Future of MCP Authentication & Authorization"

**Reddit:** r/mcp and r/AI_Agents surface implementation war stories faster
than blogs do, but are noisier — good for "has anyone hit this problem"
searches, not for foundational reading.

**Primary sources (worth reading once, not daily):**
- Linux Foundation A2A spec + [Agent2Agent Wikipedia page](https://en.wikipedia.org/wiki/Agent2Agent) for the plain-English summary
- MCP 2026-07-28 authorization spec (RFC 9728, RFC 8707 references)
- arXiv 2603.24775 — AIP: Agent Identity Protocol for Verifiable Delegation
- arXiv 2606.31498 — "Governance Gaps in Agent Interoperability Protocols" (MCP/A2A/ACP)

---

## 3. Today's picks (2026-08-22)

1. [A2A Protocol Security: Authenticating Agent-to-Agent Communication](https://securew2.com/blog/a2a-protocol-security) — good overview of why A2A's HTTPS-only baseline isn't enough (card tampering, replay).
2. [MCP 2026 spec: what changes for AI agent authentication](https://workos.com/blog/mcp-2026-spec-agent-authentication) — the July 28 spec revision, explained practically.
3. [Securing AI Agents: The Future of MCP Authentication & Authorization](https://cenrax.substack.com/p/securing-ai-agents-the-future-of) — Substack pick for today.

## 4. Today's small task (habit-builder, ~20–30 min)

Read source #1 above, then write a 3–5 sentence note in this file (append to
a "Day log" section below) answering: *if A2A doesn't mandate agent-card
verification, what's the minimum you'd add to a toy implementation to make
impersonation hard?* No need to code yet — Day 1 is a reading + reflection
day. Starting tomorrow, alternate reading days with a build day on the toy
2-agent OAuth demo described in "Next" above.

---

## Day log

- **2026-08-22** — Tracker created. Concept map and reading list seeded.
  Awaiting first reflection entry (see task above).
