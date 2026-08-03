# RCB Ladder Challenge — Cloudflare Workers deployment

This is the same app you've been using inside Claude, restructured to run as
a real, standalone Cloudflare **Worker** (not Pages) with its own storage.

## Why previous attempts failed

1. **`window.storage`** only exists inside Claude's own artifact preview —
   outside it, every save silently failed. Fixed by replacing it with a real
   backend.
2. **Pages Functions vs Workers** — an earlier version of this project used
   the `functions/api/storage.js` convention, which only works on Cloudflare
   **Pages**. Your project is a Cloudflare **Worker**, which is a different
   (newer, unified) deployment pipeline. This version is built for that:
   a single Worker (`worker/index.js`) that serves both the API and the
   static site, using the official `@cloudflare/vite-plugin`.
3. **Vite version** — Cloudflare's Vite integration for Workers requires
   Vite 6+. This project is pinned to Vite 6.4.x.

I've tested `npm install`, `npm run build`, and `wrangler deploy --dry-run`
against this exact set of files and they all complete successfully.

## One-time setup on Cloudflare

### 1. Create a KV namespace

```bash
npx wrangler kv namespace create STORAGE
```

This prints an `id`. Copy it.

(Alternatively: Cloudflare dashboard → **Workers & Pages** → **KV** →
**Create a namespace**, then copy its ID from the namespace's detail page.)

### 2. Add that ID to `wrangler.jsonc`

Open `wrangler.jsonc` and replace `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` with
the ID from step 1:

```jsonc
"kv_namespaces": [
  { "binding": "STORAGE", "id": "your-real-id-here" }
]
```

Commit this change. (KV namespace IDs aren't secret, so it's fine to commit —
they're meaningless without your Cloudflare account credentials.)

### 3. Push to GitHub

Push this project — with `wrangler.jsonc` updated — as the **entire contents
of the repo root** (no subfolder wrapping it; `package.json` must sit at the
top level of the repo that Cloudflare clones).

Cloudflare's Workers Build system will detect the Vite framework
automatically, run `npm run build`, and deploy.

## Local development

```bash
npm install
npm run dev
```

This runs the Worker (API included) inside the real Workers runtime via
Miniflare — `/api/storage` works locally too, using a local KV simulation.

## Manual deploy (optional)

If you ever want to deploy from your own machine instead of via GitHub:

```bash
npm run deploy
```

(Requires `npx wrangler login` once, to authenticate with your Cloudflare
account.)

## How data is shared vs personal

- **Shared data** (the ladder, challenges, settings) is stored under key
  `s:<key>` in KV — every visitor reads and writes the same record.
- **Personal data** ("who am I on this device", admin unlock) is stored under
  `p:<deviceId>:<key>`, where `deviceId` is a random ID generated once and
  kept in that browser's `localStorage`.

## Admin passcode

Still the `ADMIN_PASSCODE` constant near the top of `src/App.jsx`. Change it
there before your first deploy if you'd like something other than the
default.

## Project structure

```
wrangler.jsonc       — Worker config: name, KV binding, assets routing
worker/index.js      — The Worker: /api/storage handler + static asset fallback
vite.config.js       — Vite config with the Cloudflare + React plugins
index.html           — Vite entry HTML
src/main.jsx         — Mounts the React app (imports storageClient first)
src/storageClient.js — window.storage polyfill that calls /api/storage
src/App.jsx          — The app itself (unchanged from the Claude version)
```
