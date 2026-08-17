// Cloudflare Worker entry point.
//
// Handles /api/storage (backed by the STORAGE KV namespace binding) and
// falls back to serving the built static site (env.ASSETS) for everything
// else. Wired up via wrangler.jsonc's "main" field and the
// @cloudflare/vite-plugin, which builds this alongside the Vite client app.
//
// Also runs a daily Cron Trigger (see wrangler.jsonc "triggers") that
// applies Order of Merit inactivity penalties server-side, once per day,
// so it doesn't depend on someone having the app open and doesn't risk
// being applied twice by two people's browsers at once.

const DEFAULT_OOM_SETTINGS = {
  oomInactivityDays: 45,
  oomInactivityPenalty: -5,
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
}

function fullKey(key, shared, deviceId) {
  return shared ? `s:${key}` : `p:${deviceId || "unknown"}:${key}`;
}

async function handleGet(request, env) {
  if (!env.STORAGE) {
    return jsonResponse({ error: "STORAGE KV binding is not configured on this Worker." }, 500);
  }
  const url = new URL(request.url);
  const key = url.searchParams.get("key");
  const shared = url.searchParams.get("shared") === "true";
  const deviceId = url.searchParams.get("deviceId") || "";

  if (!key) return jsonResponse({ error: "key is required" }, 400);

  const value = await env.STORAGE.get(fullKey(key, shared, deviceId));
  if (value === null) return jsonResponse(null);
  return jsonResponse({ key, value, shared });
}

async function handlePost(request, env) {
  if (!env.STORAGE) {
    return jsonResponse({ error: "STORAGE KV binding is not configured on this Worker." }, 500);
  }
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body" }, 400);
  }

  const { action, key, value, shared, prefix, deviceId } = body;

  if (action === "set") {
    if (!key) return jsonResponse({ error: "key is required" }, 400);
    await env.STORAGE.put(fullKey(key, shared, deviceId), String(value));
    return jsonResponse({ key, value, shared });
  }

  if (action === "delete") {
    if (!key) return jsonResponse({ error: "key is required" }, 400);
    await env.STORAGE.delete(fullKey(key, shared, deviceId));
    return jsonResponse({ key, deleted: true, shared });
  }

  if (action === "list") {
    const kvPrefix = shared ? `s:${prefix || ""}` : `p:${deviceId || "unknown"}:${prefix || ""}`;
    const listed = await env.STORAGE.list({ prefix: kvPrefix });
    const stripLen = shared ? 2 : `p:${deviceId || "unknown"}:`.length;
    const keys = listed.keys.map((k) => k.name.slice(stripLen));
    return jsonResponse({ keys, prefix: prefix || "", shared });
  }

  return jsonResponse({ error: `Unknown action "${action}"` }, 400);
}

// Reads the ladder + Order of Merit tracking/ledger directly from KV, works
// out who's gone too long without issuing a challenge, and appends penalty
// entries to the ledger. Designed to be safe to run more than once in a day
// (it won't double-penalize) since it advances each bowler's
// lastPenaltyAppliedAt by exactly one inactivity period per penalty applied.
async function applyInactivityPenalties(env) {
  if (!env.STORAGE) return { applied: 0, error: "No STORAGE binding" };

  const [settingsRaw, ladderRaw, trackingRaw, ledgerRaw] = await Promise.all([
    env.STORAGE.get("s:rcb-settings"),
    env.STORAGE.get("s:ladder"),
    env.STORAGE.get("s:oom-tracking"),
    env.STORAGE.get("s:oom-ledger"),
  ]);

  const settings = { ...DEFAULT_OOM_SETTINGS, ...(settingsRaw ? JSON.parse(settingsRaw) : {}) };
  const ladder = ladderRaw ? JSON.parse(ladderRaw) : [];
  const tracking = trackingRaw ? JSON.parse(trackingRaw) : {};
  const ledger = ledgerRaw ? JSON.parse(ledgerRaw) : [];

  const days = Number(settings.oomInactivityDays) || 45;
  const penalty = Number(settings.oomInactivityPenalty) || 0;
  const periodMs = days * 24 * 60 * 60 * 1000;
  const now = Date.now();

  let changed = false;
  let applied = 0;

  for (const b of ladder) {
    if (!tracking[b.id]) {
      // First time we've seen this bowler: start their clock now rather
      // than penalizing them for time before the feature existed.
      tracking[b.id] = { lastActiveAt: now, lastPenaltyAppliedAt: now };
      changed = true;
      continue;
    }
    const t = tracking[b.id];
    // Keep applying penalties for each full inactivity period that has
    // elapsed since the last one, as long as they still haven't challenged
    // since then.
    while (now - t.lastPenaltyAppliedAt >= periodMs && t.lastActiveAt <= t.lastPenaltyAppliedAt) {
      ledger.push({
        id: `oom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        bowlerId: b.id,
        points: penalty,
        type: "inactivity",
        note: `No challenge issued in ${days} days`,
        at: t.lastPenaltyAppliedAt + periodMs,
      });
      t.lastPenaltyAppliedAt += periodMs;
      changed = true;
      applied += 1;
    }
  }

  if (changed) {
    await Promise.all([
      env.STORAGE.put("s:oom-tracking", JSON.stringify(tracking)),
      env.STORAGE.put("s:oom-ledger", JSON.stringify(ledger)),
    ]);
  }

  return { applied };
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/storage") {
      if (request.method === "GET") return handleGet(request, env);
      if (request.method === "POST") return handlePost(request, env);
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    // Manual trigger for testing the inactivity check without waiting for
    // the daily cron (e.g. curl -X POST https://your-worker/api/oom/run-inactivity-check).
    // Not linked from the UI — intended for admin/CLI use while testing.
    if (url.pathname === "/api/oom/run-inactivity-check" && request.method === "POST") {
      const result = await applyInactivityPenalties(env);
      return jsonResponse(result);
    }

    // Everything else: serve the built static site.
    return env.ASSETS.fetch(request);
  },

  async scheduled(event, env, ctx) {
    ctx.waitUntil(applyInactivityPenalties(env));
  },
};

