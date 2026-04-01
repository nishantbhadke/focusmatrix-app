# Hosted Deployment Plan

This is the clean path to make the GitHub Pages app work against a public API.

## Recommended Stack

- Frontend: GitHub Pages
- API: Koyeb
- Database: MongoDB Atlas
- Cache: Valkey-compatible service, optional

## Why This Split

- GitHub Pages is a strong low-cost frontend host, but it cannot run Node.js or MongoDB.
- Koyeb is a straightforward place to host a small Node API directly from GitHub.
- MongoDB Atlas gives a free starting point for a public Mongo deployment.
- Valkey is useful for dashboard, weekly report, export, and metadata cache reads.

## Frontend Runtime Config

Edit [runtime-config.js](/C:/Users/nisha/Downloads/files/config/runtime-config.js):

```js
window.FocusMatrixRuntime = {
  apiBaseUrl: "https://your-api-name.koyeb.app",
  apiDocsUrl: "https://your-api-name.koyeb.app/swagger"
};
```

Commit and push that change when your public API is ready.

## Backend Environment

Set these on the hosted API:

```bash
HOST=0.0.0.0
PORT=3000
MONGODB_URL=mongodb+srv://<user>:<password>@<cluster-url>/focusmatrix
MONGODB_DB=focusmatrix
VALKEY_URL=redis://default:<password>@<host>:<port>
```

If `VALKEY_URL` is omitted, the backend still works. Caching is optional.

## Hosting Steps

### 1. MongoDB Atlas

- Create a free cluster
- Create a database user
- Allow your app host IP or allow all temporarily for setup
- copy the connection string into `MONGODB_URL`

### 2. Koyeb API

- Create a new web service from the GitHub repo
- Root directory: `backend`
- Build command: `npm install`
- Run command: `npm start`
- Set the environment variables listed above

### 3. GitHub Pages Frontend

- Keep Pages on `GitHub Actions`
- Set the public API URL in `config/runtime-config.js`
- Push to `main`
- Let the Pages workflow redeploy

## What Valkey Helps With

- `/api/meta`
- `/api/tasks` filtered reads
- `/api/dashboard`
- `/api/report/weekly`
- `/api/export`

Write operations automatically invalidate cached views in the current backend implementation.

## Notes

- The live app route should be treated as the real product route.
- The prototype route should remain safe and browser-only.
- When public auth is added later, the API should stop using the dev reset route in public environments.
