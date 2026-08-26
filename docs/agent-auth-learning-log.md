# Agent Auth / A2A Learning Log

Personal project: build working knowledge of authentication & authorization for
agent-to-agent (A2A) communication, then use that knowledge toward a real
project (candidate: an auth/identity layer for FocusMatrix's own agents, or a
standalone A2A auth demo).

This file is a running log, updated on each scheduled check-in. Newest entry
on top. Each entry: status, blockers/design questions, today's reading, and a
small daily task to build the habit.

---

## How to read this log (concept map — read this section once, refer back)

To follow the A2A auth space you need to track four buckets:

1. **The protocols agents actually speak**
   - **A2A (Agent2Agent)** — Google-originated, now under the Linux
     Foundation (transferred June 2025). Defines how two agents discover and
     talk to each other over HTTP(S)/JSON-RPC/SSE. Treats each agent as a
     normal enterprise app: identity lives at the HTTP transport layer (TLS
     client certs, OAuth bearer tokens), not inside the message payload.
     Spec + SDKs: https://github.com/a2aproject/A2A
   - **MCP (Model Context Protocol)** — Anthropic's protocol for an agent
     calling *tools/resources*, not other agents. Different problem (tool
     authorization) but constantly compared/combined with A2A, and its own
     auth story (OAuth-based) is still evolving — worth tracking in parallel.
   - Also on the radar but earlier-stage: **ACP**, **Agora**, **ANP** — other
     agent-interop protocols mentioned in comparative threat-modeling papers.

2. **The identity primitives underneath the protocols** — this is the part
   that's actually hard and where the design questions live:
   - **OAuth 2.0 / 2.1 + OIDC** — delegated authorization for a human
     principal acting through an app. A2A leans on this today (OAuth bearer
     tokens, JWTs) but it assumes a human is ultimately behind the token,
     which breaks down for autonomous multi-step agent chains.
   - **SPIFFE / SPIRE (SVIDs)** — workload identity: cryptographically
     verifiable, short-lived identities for *machines/services*, not humans.
     Answers "prove what this agent actually is" before you even get to
     authorization. Increasingly proposed as the missing bootstrap layer
     under agent auth.
   - **IETF WIMSE** (Workload Identity in Multi-cloud/Service Environments) —
     standardizing service-to-service workload identity; the thing SPIFFE
     implementations are converging toward.
   - **OIDC-A (OpenID Connect for Agents)** — extends OIDC specifically for
     agents: delegation-chain validation ("who authorized this agent, on
     whose behalf, through how many hops"), attestation, capability-based
     authorization. This is the one to watch most closely — it's the
     standards body most directly targeting *your* problem statement.
   - **Delegation chains / capability tokens** — the recurring hard problem:
     when Agent A asks Agent B to act on behalf of User X via Agent C, how do
     you (a) prove the chain cryptographically, (b) scope down permissions at
     each hop (least privilege), and (c) revoke mid-chain.

3. **The bodies setting direction**
   - **NIST AI Agent Standards Initiative** (announced Feb 2026) — three
     pillars: industry-led agent standards, community protocol development,
     and agent security/identity research. This is the one to check
     quarterly for what's becoming "official."
   - **OpenID Foundation** — published a consensus whitepaper on agentic
     identity; home of OIDC-A.
   - **Linux Foundation** — now stewards A2A.

4. **The threat model layer** — read these when you want to know what can go
   wrong, not just what the spec says:
   - Comparative threat modeling of MCP/A2A/Agora/ANP (arXiv 2602.11327)
   - "Governance Gaps in Agent Interoperability Protocols" (arXiv 2606.31498)
     — what MCP/A2A/ACP still *can't* express (useful for finding your own
     project's differentiator)
   - "Before the Tool Call: Deterministic Pre-Action Authorization" (arXiv
     2603.20953) — pre-action authorization gating, relevant if your project
     leans toward policy enforcement rather than just identity

**The one-sentence mental model:** OAuth/OIDC answers "is this request
authorized," SPIFFE/WIMSE answers "is this really the workload it claims to
be," and OIDC-A/delegation-chain work is the emerging layer that tries to
answer both *for a chain of agents acting on someone else's behalf* — which
is the actual A2A problem, and still unsettled. That gap is where a personal
project has room to say something original.

---

## Entry — 2026-08-26 (Day 1: initialized)

**Status:** No existing project artifacts found in this repo for A2A
auth — this is the first tracked entry. Treating today as project kickoff.

**In progress:** Nothing yet — concept map above is the starting baseline.

**Blocked on:** Nothing blocking; the open item is a *decision*, not a
blocker — see design question below.

**Design question to resolve (carry forward until answered):**
Pick the shape of the personal project before writing code:
  (a) a minimal A2A-protocol demo (two toy agents + OAuth/JWT handshake,
      following the a2aproject/A2A spec), or
  (b) an OIDC-A-flavored delegation-chain prototype (issue a token, delegate
      it through 2-3 hops, verify + scope-down at each hop, then revoke), or
  (c) a policy/authorization-gate layer sitting in front of an existing
      agent (pre-action authorization, per the arXiv 2603.20953 pattern).
  (b) is the most novel relative to existing OSS demos; (a) is the fastest
  to a working "hello world." Default recommendation: start with (a) for a
  week to get the transport/identity mechanics under your fingers, then
  fold in (b)'s delegation chain once the basic handshake works.

**Today's reading (rotate sources daily — don't repeat a source two days running):**
- Substack: *Latent Space* (swyx) — https://www.latent.space/ — top pick for
  AI-engineer-audience deep dives on agent architectures and framework
  internals.
- Reference doc (not a blog, but read once as grounding): A2A protocol
  announcement — https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/
- Reddit: r/AI_Agents and r/mcp — search "A2A auth" / "agent identity" for
  practitioner threads (noisier than the above, but good for "what actually
  broke in production" anecdotes).

**Today's small habit task (~20–30 min, pick one):**
Read the A2A authentication section of the spec
(https://github.com/a2aproject/A2A) and write 3 bullet points in this log
(next entry) on how it handles bearer-token delegation between two agents —
specifically, what happens if Agent B needs to call Agent C on behalf of the
original caller. That question is exactly the gap called out above, so your
notes double as research for the design question.

**Sources used to compile today's entry:**
- [Agent2Agent — Wikipedia](https://en.wikipedia.org/wiki/Agent2Agent)
- [Announcing the Agent2Agent Protocol (A2A) — Google Developers Blog](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [Agent2Agent (A2A) authentication — Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/agent-to-agent-authentication)
- [GitHub - a2aproject/A2A](https://github.com/a2aproject/A2A)
- [How to enhance Agent2Agent (A2A) security — Red Hat Developer](https://developers.redhat.com/articles/2025/08/19/how-enhance-agent2agent-security)
- [Cryptographically Verifiable SPIFFE Identity — Palo Alto Networks](https://www.paloaltonetworks.com/blog/identity-security/ai-agent-security-spiffe-machine-identity/)
- [Workload Identity for Agents: SPIFFE/SPIRE vs. OAuth Client Credentials — MojoAuth](https://mojoauth.com/blog/workload-identity-for-agents-spiffe-spire-vs-oauth-client-credentials)
- [AI Agent Authentication and Authorization — IETF draft](https://www.ietf.org/archive/id/draft-klrc-aiagent-auth-00.html)
- [How SPIFFE and Relationship-Based Auth Work for AI Agents — Stacklok](https://stacklok.com/blog/agentic-identity-explained-how-to-apply-spiffe-and-relationship-based-authorization-to-ai-agents-in-2026/)
- [Identity Management for Agentic AI — arXiv](https://arxiv.org/pdf/2510.25819)
- [Latent Space](https://www.latent.space/)
