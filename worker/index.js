// Cloudflare Worker entry point.
//
// Handles /api/storage (backed by the STORAGE KV namespace binding) and
// falls back to serving the built static site (env.ASSETS) for everything
// else. Wired up via wrangler.jsonc's "main" field and the
// @cloudflare/vite-plugin, which builds this alongside the Vite client app.

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

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname === "/api/storage") {
      if (request.method === "GET") return handleGet(request, env);
      if (request.method === "POST") return handlePost(request, env);
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    // Everything else: serve the built static site.
    return env.ASSETS.fetch(request);
  },
};
