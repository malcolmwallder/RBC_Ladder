// Cloudflare Pages Function: /api/storage
//
// Backs the app's window.storage API with a Cloudflare KV namespace.
// Bind a KV namespace to this Pages project as "STORAGE"
// (Pages project -> Settings -> Functions -> KV namespace bindings).
//
// Key layout inside KV:
//   shared data  -> "s:<key>"
//   personal data -> "p:<deviceId>:<key>"

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

export async function onRequestGet({ request, env }) {
  if (!env.STORAGE) {
    return jsonResponse({ error: "STORAGE KV binding is not configured on this Pages project." }, 500);
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

export async function onRequestPost({ request, env }) {
  if (!env.STORAGE) {
    return jsonResponse({ error: "STORAGE KV binding is not configured on this Pages project." }, 500);
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
