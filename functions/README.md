# RCB Ladder Challenge — Cloudflare Pages deployment

This is the same app you've been using inside Claude, restructured so it can
run as a real, standalone site on Cloudflare Pages with its own storage.

## Why the old copy lost data

The version built inside Claude used a `window.storage` API that only exists
inside Claude's own artifact preview. Outside that environment (e.g. once
hosted on Cloudflare Pages), those calls silently fail, so nothing was ever
actually saved — that's why the user you created disappeared the moment you
reopened the page.

This version replaces that with a real backend: a Cloudflare Pages Function
(`functions/api/storage.js`) backed by a Cloudflare **KV** namespace, and a
small client-side shim (`src/storageClient.js`) that makes the app's existing
code work against it without any changes to the app logic itself.

## One-time setup on Cloudflare

1. **Create a KV namespace**
   Cloudflare dashboard → **Workers & Pages** → **KV** → **Create a namespace**.
   Name it something like `rcb_storage`.

2. **Bind it to your Pages project**
   Your Pages project → **Settings** → **Functions** → **KV namespace bindings**
   → **Add binding**.
   - Variable name: `STORAGE` (must match exactly — the function code looks for `env.STORAGE`)
   - KV namespace: the one you just created

   Do this for **both** the Production and Preview environments, or preview
   deployments (e.g. pull request previews) will 500 on save.

3. **Set the build configuration** (Pages project → Settings → Builds & deployments)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (or wherever this folder sits in your repo)

4. **Push this code to your GitHub repo** (`malcolmwallder/RBC_Ladder`).
   Cloudflare will build and deploy automatically. Every push redeploys.

## Local development

```bash
npm install
npm run dev
```

Note: `npm run dev` (plain Vite) won't have `/api/storage` available, since
that only runs as a Cloudflare Pages Function. To test the full app locally
including storage, use Wrangler instead:

```bash
npm run build
npx wrangler pages dev dist --kv STORAGE
```

## How data is shared vs personal

- **Shared data** (the ladder, challenges, settings) is stored under key
  `s:<key>` in KV — every visitor reads and writes the same record.
- **Personal data** ("who am I on this device", admin unlock) is stored under
  `p:<deviceId>:<key>`, where `deviceId` is a random ID generated once and
  kept in that browser's `localStorage`. Clearing site data / using a
  different browser resets that device's identity, same as before.

## Admin passcode

Still the `ADMIN_PASSCODE` constant near the top of `src/App.jsx`. Change it
there before your first deploy if you'd like something other than the
default.
