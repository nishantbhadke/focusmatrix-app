# Personal Project Log: Agent Authentication & Authorization for A2A

Tracking doc for the recurring "review and advance" routine on agent
authentication / authorization for Agent-to-Agent (A2A) communication.
Updated on each run: status, blockers, daily reading, and a small daily task.

## Project status

| Field | Value |
|---|---|
| Started | 2026-08-02 |
| State | **Initialized** — no prior work existed in this repo before today |
| In progress | Building the concept glossary below; no code/demo started yet |
| Blocked on | Nothing yet — first design decision is picking an anchor build target (see "Next" below) |
| Next | Decide the anchor project: a minimal demo where two toy agents authenticate to each other and exchange a scoped, short-lived credential (candidates: OAuth 2.1 client-credentials + token exchange (RFC 8693), vs. SPIFFE/SPIRE-issued SVIDs, vs. Google's A2A "Agent Card" + bearer token flow) |

### Design questions to resolve
- **Which identity primitive to standardize on for the demo**: OAuth bearer tokens (familiar, but bearer = stealable) vs. SPIFFE SVIDs (mTLS, cryptographically bound, steeper setup) vs. a hybrid (SPIFFE for workload identity, OAuth token exchange for delegated user-scoped calls). No answer yet — this is the first real blocker to resolve, likely in the next 1-2 sessions.
- **Where authorization logic lives**: A2A (Google's protocol) explicitly punts on authorization — it only standardizes how agents advertise auth *schemes* via the Agent Card, not who's allowed to do what. Need to decide: hand-rolled scope checks, or a policy engine (OPA/Cedar, or a hosted option like Permit.io)?

## Core concepts to stay fluent in

A running glossary — the "things to keep in the loop" to actually understand this space, not just vocabulary-drop it:

- **Authentication vs. authorization** — proving *which* agent this is, vs. deciding *what that agent is allowed to do*. Most current protocols (A2A, MCP) solve the first and leave the second to the implementer. This gap is the recurring theme across nearly everything read this month.
- **Agent Card** (A2A-specific) — a public manifest an agent exposes describing its capabilities and which auth schemes it accepts. Discovery happens *before* auth. Cards can be tampered with/spoofed if not signed — signing/PKI is an open problem in the ecosystem, not yet standardized.
- **SPIFFE / SPIRE / SVID** — SPIFFE is a standard for workload (machine) identity; SPIRE is the runtime that issues **SVIDs** (SPIFFE Verifiable Identity Documents), short-lived, auto-rotating, cryptographically verifiable IDs — the mTLS-native alternative to long-lived API keys.
- **WIMSE** (Workload Identity in Multi-System Environments) — the IETF working group extending SPIFFE-style identity across organizational/system boundaries, which matters once agents call *other companies'* agents, not just internal services.
- **AIMS** (Agent Identity Management System, IETF draft `draft-klrc-aiagent-auth-00`, published March 2026 by engineers from Defakto, AWS, Zscaler, Ping Identity) — composes SPIFFE + WIMSE + OAuth 2.0 into one stack aimed specifically at "how does an AI agent prove who it is." Authentication-only; explicitly leaves authorization out of scope.
- **OAuth 2.1 client-credentials & token exchange (RFC 8693)** — the "on-behalf-of" pattern: an agent exchanges its own credential plus a user's original token for a new, narrower-scoped token to act on that user's behalf. This is how delegation chains (user → orchestrator agent → sub-agent → tool) are supposed to stay auditable instead of just forwarding one god-token everywhere.
- **JWT / JWKS / audience validation** — the mechanics underneath most of the above: signed claims, the public-key endpoint used to verify signatures, and checking a token was actually minted *for this specific agent/server* (not just valid in general — this is what stops token replay against the wrong service).
- **Capability-based / scoped, short-lived tokens** — the security mental model favored across nearly every source read: not "is this agent trusted," but "this token grants exactly this action, on this resource, for this many minutes, delegated by this principal." Smaller blast radius per credential.
- **mTLS** — mutual TLS, where both sides present certificates; pairs naturally with SPIFFE SVIDs for agent-to-agent transport-layer identity, independent of whatever's happening at the application/token layer.
- **MCP (Model Context Protocol) auth** — separate from A2A; governs how an agent authenticates *to a tool/data server* it's using, not to another agent. Current state is weak in practice: a 2026 survey of 5,200+ open MCP servers found 53% still rely on static API keys and only ~8.5% use OAuth.

## Reading log

| Date | Source | Why it's the pick |
|---|---|---|
| 2026-08-02 | [AI agent authorization with A2A protocol and HashiCorp Vault](https://hashicorpengineering.substack.com/p/a2a-vault-oidc) (HashiCorp Engineering, Substack) | Most concrete/practical of everything surfaced today — walks through using Vault as an OIDC provider so an A2A client agent gets a real access token to call an A2A server, instead of staying theoretical about "agents should use OAuth." Good first hands-on reference for the anchor-project design question above. |

Other strong candidates surfaced today, worth a look later:
- [IETF AIMS: How AI Agents Authenticate with SPIFFE and OAuth 2.0](https://dev.to/iamdevbox/ietf-aims-how-ai-agents-authenticate-with-spiffe-and-oauth-20-2g0i) — best single explainer of the AIMS draft.
- [AI Agent Authentication Gets the Hard Part Right. Authorization Is Still Your Problem.](https://www.rockcybermusings.com/p/i-agent-authentication-authorization-gap) — sharpest statement of the auth-vs-authz gap theme.
- [Edition #2: Agent Security Standards + Identity/Authorization](https://boringappsec.substack.com/p/edition-2-agent-security-standards) (boringappsec, Substack) — good recurring Substack to subscribe to for this beat.
- [Securing Agent-to-Agent (A2A) Communication](https://arnav.au/2026/07/16/securing-agent-to-agent-a2a-communication/) — independent blog, practitioner take on closing the gaps A2A leaves open (signed cards, mTLS, PKI).

## Daily micro-task log

Small, ~15-20 min tasks meant to build a daily habit without requiring a big block of time.

- **2026-08-02**: Read the HashiCorp Vault + A2A OIDC post above and write 3 bullet notes here (next entry) on: (1) what token Vault actually issues, (2) how the A2A client presents it to the A2A server, (3) one thing you'd change for a *delegated* (on-behalf-of-a-user) flow instead of the service-to-service flow shown. This directly feeds the "which identity primitive" design question above.
