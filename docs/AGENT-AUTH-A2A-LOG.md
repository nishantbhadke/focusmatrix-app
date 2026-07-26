# Agent Auth / A2A Learning & Project Log

Personal learning + project-tracking log for "agent authentication and
authorization for Agent-to-Agent (A2A) communication." Updated by the
recurring review routine. Not part of the FocusMatrix product — this repo
is just where the log lives for now since no dedicated repo exists yet.

## Status as of 2026-07-26

**First entry.** No prior log existed anywhere in scope, and there is no
dedicated code project for agent auth / A2A yet — just the intent to
build one. This entry establishes the baseline.

- **In progress:** nothing coded yet. Concept map + reading list started
  below.
- **Blocked on / open design question:** which stack to prototype in.
  Two real options:
  1. ASP.NET Core (C#) — plays to existing day-job skillset (BFSI
     compliance workflows, maker-checker approval chains, REST APIs),
     fast to get a working OAuth2 client-credentials demo between two
     services.
  2. The reference A2A SDK (Python/Node, from `a2aproject/A2A` on
     GitHub) — closer to what the actual ecosystem/tooling uses, more
     transferable if the goal is to interoperate with real agent
     frameworks (LangGraph, CrewAI, MCP servers, etc.).
  No need to decide today — first few sessions are reading/concepts, not
  code. Revisit this once the concept checklist below feels solid.
- **Next:** do the first small daily task (see bottom of this file), then
  start a real scaffold once the stack question is resolved.

## Concept checklist — what to stay in the loop on

Core vocabulary and ideas that keep coming up across every source below.
Treat this as the map; each daily reading should slot into one of these
buckets.

1. **Non-human identity (NHI).** Agents need an identity distinct from
   the human who launched them or the service account that hosts them.
   This is the foundational shift — most existing IAM assumes a human or
   a static service account, not something that acts autonomously and
   ephemerally.
2. **OAuth 2.0/2.1 grant types for agents.** Client-credentials (agent
   acting as itself) vs. token exchange / on-behalf-of (RFC 8693, agent
   acting *for* a specific user) vs. delegation chains (agent A calling
   agent B, which calls agent C). Knowing which grant fits which
   relationship is the crux of most real designs.
3. **The "who is this agent acting for" problem.** Standard OAuth tokens
   don't have a clean way to express "this agent is authorized to do X,
   on behalf of human Y, with scope Z, revocable how." This gap is the
   subject of active protocol work (see AIP, verifiable delegation
   below) — worth tracking because it's unsettled, not solved.
4. **MCP's auth model.** OAuth 2.1 + PKCE (mandatory), Protected
   Resource Metadata, authorization-server discovery. A major spec
   revision is landing July 28, 2026 — directly relevant right now.
5. **A2A's auth model.** Google's Agent2Agent protocol (now under Linux
   Foundation) treats agents like standard enterprise apps: identity
   lives at the HTTP transport layer, not inside message payloads.
   Agents declare supported schemes (OAuth2, OIDC, API keys, mTLS) in an
   "Agent Card"; credential acquisition itself is explicitly
   out-of-band/unspecified by the protocol.
6. **Least privilege + short-lived credentials.** Scoped, expiring
   tokens over long-lived static API keys — same zero-trust instinct as
   human IAM, but agents make the blast radius of a leaked credential
   worse because they act continuously and autonomously.
7. **Confused-deputy risk between agents.** Agent A has legitimate
   access to a resource; Agent B tricks/uses A to act beyond B's own
   authorization. This is the agent-world version of the classic
   confused-deputy problem, and it's the main new attack class these
   protocols have to design against.
8. **Audit trail / observability.** Every agent action needs to trace
   back to an authorization decision and the human-directed task behind
   it — this is the part that maps most directly onto BFSI maker-checker
   experience.
9. **Emerging/competing protocols worth recognizing by name:** MCP
   (tool access), A2A (agent-to-agent), ANP, Agora, and newer proposals
   like AIP (Agent Identity Protocol) for verifiable delegation across
   MCP and A2A. Don't need depth on all of them yet — just enough to
   recognize what problem each is solving when it comes up in reading.

## Reading sources to rotate through

No single outlet covers this well yet since the space is new — mix
practitioner Substacks, vendor engineering blogs, and primary specs/repos.

- **Substacks:** trilogyai.substack.com (enterprise MCP/agent deployment
  analysis), cenrax.substack.com and kenhuangus.substack.com (MCP auth
  deep dives), markaorlando.substack.com (security leadership angle),
  rodtrent.substack.com (Microsoft/zero-trust angle), gradientflow.substack.com
  (AI-security trends), martinschroder.substack.com (agentic engineering).
- **Vendor/engineering blogs:** Red Hat Developer (A2A security),
  Cloudflare (OAuth + MCP client guides), GitGuardian blog (agent
  identity), Akeyless blog (runtime authorization for agents), aport.io
  blog (agent-auth-as-a-product — interesting given the FocusMatrix
  instinct toward SaaS/product framing).
- **Primary sources:** `github.com/a2aproject/A2A` (spec + issues — read
  discussion threads like a Reddit feed), Microsoft Learn's A2A
  authentication docs, arXiv papers when a topic needs real depth (e.g.
  "AIP: Agent Identity Protocol", "Security Threat Modeling for Emerging
  AI-Agent Protocols: MCP, A2A, Agora, ANP").
- **Community:** r/AI_Agents and r/mcp on Reddit for practitioner pain
  points (couldn't be searched directly this run — check manually).

### Today's pick (2026-07-26)

["MCP Grows Up: What the July 28 Spec Means for Every Enterprise Agent
Deployment"](https://trilogyai.substack.com/p/mcp-grows-up-what-the-july-28-spec) —
timely because the spec it covers ships in two days. Pair it with a skim
of the "Agent Card" / auth-scheme section of
[`a2aproject/A2A`](https://github.com/a2aproject/A2A) on GitHub to see
the same problem solved a different way by a different protocol.

## Daily habit — small task rotation

Keep it to ~15-20 minutes/day, rotating so it doesn't become passive
reading only:

- **Type A (read):** one article or repo doc from the list above, end
  with 3 bullet takeaways appended to this log.
- **Type B (build):** one small hands-on step — issue and verify a JWT,
  wire up an OAuth2 client-credentials call between two local services,
  read/annotate an Agent Card JSON example.
- **Type C (write):** turn one takeaway into a paragraph — either added
  here or drafted as a short public note (LinkedIn/Substack), which
  doubles as practice for the product/marketing side already shown in
  `PITCH.md`.

**Today's suggested task:** Type A — read the MCP July 28 spec article
above, write 3 takeaways here, and jot which of the two stack options
(ASP.NET Core vs. reference A2A SDK) it makes you lean toward.

---

*This file is maintained by the recurring "agent auth / A2A projects"
review routine. Append dated entries above as the project actually
starts, rather than editing this baseline away.*
