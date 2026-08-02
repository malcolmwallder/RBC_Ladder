// Re-implements the window.storage API (get/set/delete/list) that the app
// expects, but backed by our own /api/storage Cloudflare Pages Function +
// KV namespace instead of Claude's artifact runtime.
//
// This file must be imported before the App component mounts (see main.jsx).

function getDeviceId() {
  const STORAGE_KEY = "rcb-device-id";
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = (crypto.randomUUID && crypto.randomUUID()) || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}

const deviceId = getDeviceId();

async function apiGet(key, shared) {
  const params = new URLSearchParams({ key, shared: String(!!shared), deviceId });
  const res = await fetch(`/api/storage?${params.toString()}`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `storage get failed (${res.status})`);
  }
  return res.json(); // null, or { key, value, shared }
}

async function apiPost(payload) {
  const res = await fetch("/api/storage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload, deviceId }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `storage request failed (${res.status})`);
  }
  return res.json();
}

window.storage = {
  get: (key, shared = false) => apiGet(key, shared),
  set: (key, value, shared = false) => apiPost({ action: "set", key, value, shared }),
  delete: (key, shared = false) => apiPost({ action: "delete", key, shared }),
  list: (prefix = "", shared = false) => apiPost({ action: "list", prefix, shared }),
};
