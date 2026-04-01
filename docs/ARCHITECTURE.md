# FocusMatrix Architecture

This document is the working source of truth for how the current app is structured and how the hosted version should be assembled.

## System Overview

```mermaid
flowchart LR
  User["User Browser"] --> Pages["GitHub Pages<br/>Static Frontend"]
  Pages --> App["FocusMatrix UI<br/>HTML + CSS + JS"]
  App -->|Demo mode| LocalStore["Browser localStorage"]
  App -->|Live mode| Api["Node.js API"]
  Api --> Mongo["MongoDB / Atlas"]
  Api --> Cache["Valkey Cache (optional)"]
```

## Runtime Flow

```mermaid
sequenceDiagram
  participant U as User
  participant F as Frontend
  participant A as API
  participant C as Valkey
  participant M as MongoDB

  U->>F: Open app route
  F->>A: GET /health
  alt API available
    A-->>F: storage=mongodb, cache=valkey|memory
    F->>A: GET /api/export
    A->>C: Check cached payload
    alt Cache hit
      C-->>A: cached response
      A-->>F: cached snapshot
    else Cache miss
      A->>M: read tasks + history
      M-->>A: store snapshot
      A->>C: cache snapshot
      A-->>F: store snapshot
    end
  else API unavailable
    F-->>U: fallback to local browser storage
  end
```

## Deployment Topology

```mermaid
flowchart TD
  Repo["GitHub Repository"] --> Actions["GitHub Actions"]
  Actions --> Pages["GitHub Pages"]
  Repo --> Koyeb["Koyeb Web Service"]
  Koyeb --> Atlas["MongoDB Atlas"]
  Koyeb --> Valkey["Valkey Service (optional)"]
  Pages --> PublicUser["Public demo / public app"]
  PublicUser --> Pages
  Pages --> Koyeb
```

## Components

- Frontend:
  - `index.html` is the public route selector
  - `prototype/` is the safe demo route
  - `app/` is the backend-ready route
  - `config/runtime-config.js` is the deployment-time frontend API switch
- Backend:
  - `backend/src/server.js` exposes the HTTP API
  - `backend/src/providers/mongoStore.js` is the MongoDB data provider
  - `backend/src/providers/jsonStore.js` is the local fallback provider
  - `backend/src/cache.js` adds optional Valkey caching
- Infrastructure:
  - GitHub Pages serves the static frontend
  - Koyeb can host the Node backend
  - MongoDB Atlas can host the durable database
  - Valkey can accelerate cacheable API reads

## Current Modes

- Demo mode:
  - `prototype/`
  - browser-only storage
  - safest route for demos
- Local app mode:
  - `app/`
  - local backend through `backend/run-local.cmd`
  - Mongo-backed persistence
- Hosted app mode:
  - `app/`
  - GitHub Pages frontend
  - public API URL configured in `config/runtime-config.js`
  - Koyeb + Atlas + optional Valkey
