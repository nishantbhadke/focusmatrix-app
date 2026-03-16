# FocusMatrix Backend

This backend turns the current FocusMatrix prototype into a small API-driven app.

## What It Covers

- `GET /health` for service health
- `GET /api/meta` for quadrant, category, and energy metadata
- `GET /api/tasks` to list tasks by date or filters
- `POST /api/tasks` to create a task
- `PATCH /api/tasks/:id` to update a task
- `DELETE /api/tasks/:id` to remove a task
- `GET /api/dashboard?date=YYYY-MM-DD` for daily metrics
- `GET /api/report/weekly?date=YYYY-MM-DD` for weekly report card data
- `GET /api/suggestions/quadrant?text=...` for smart quadrant suggestions
- `GET /api/export` to dump the current JSON store

## Architecture

- Runtime: Node.js 18+
- Server: built-in `http` module
- Primary database option: MongoDB Community via `MONGODB_URL`
- Fallback storage: JSON file at `backend/data/focusmatrix.json`
- Analytics: same scoring model as the current frontend prototype

## Why This Shape

The current app is static and originally used `localStorage`. This backend keeps the same task model:

```json
{
  "id": 8,
  "text": "Plan sprint retro",
  "q": "Q2",
  "cat": "work",
  "energy": "high",
  "done": false,
  "date": "2026-03-16",
  "ts": 1773690000000
}
```

That means the frontend can migrate incrementally:

1. Replace `loadData()` with `GET /api/tasks` + `GET /api/dashboard`
2. Replace `saveData()` with `POST`, `PATCH`, and `DELETE`
3. Keep the existing rendering logic mostly unchanged

## Database Mode

### Option 1: MongoDB Community

Set `MONGODB_URL` in `backend/.env` or your shell:

```bash
MONGODB_URL=mongodb://127.0.0.1:27017
MONGODB_DB=focusmatrix
```

Then run:

```bash
cd backend
npm install
npm run db:init
npm start
```

The backend will create the collections automatically and seed initial data if the database is empty.

### Option 2: JSON fallback

If `MONGODB_URL` is not set, the backend keeps using the local JSON store. That is useful for quick local work, but MongoDB is the real backend path if you want durable server-side persistence.

## Run It

Install Node.js 18 or newer, then:

```bash
cd backend
npm install
node src/server.js
```

The API defaults to `http://localhost:3000`.

## Example Requests

```bash
curl http://localhost:3000/health
curl "http://localhost:3000/api/tasks?date=2026-03-16"
curl "http://localhost:3000/api/dashboard?date=2026-03-16"
curl "http://localhost:3000/api/report/weekly?date=2026-03-16"
```

Create a task:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d "{\"text\":\"Write launch copy\",\"q\":\"Q2\",\"cat\":\"work\",\"energy\":\"high\",\"done\":false,\"date\":\"2026-03-16\"}"
```

Update a task:

```bash
curl -X PATCH http://localhost:3000/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d "{\"done\":true}"
```

## Next Backend Steps

- Add multi-user auth and user-scoped task storage
- Add focus session tracking and calendar sync tables
- Add API auth, rate limiting, and audit logging
