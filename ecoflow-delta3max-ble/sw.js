// SPDX-License-Identifier: Apache-2.0
// Offline cache for the Delta 3 Max page, so it opens with no internet connection.
// Network first, always checking with the server, so updates arrive as soon as
// they are published; the cached copy is used when offline or slow.
const CACHE = "delta3max-v1";
const SHELL = [
  "./",
  "./index.html",
  "./ecoflow-delta3max.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
];
const NETWORK_TIMEOUT_MS = 3000;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // The optional credentials file is never cached. When it is missing or the
  // device is offline, answer with an empty script so the page loads cleanly.
  if (url.pathname.endsWith("/ecoflow-credentials.js")) {
    const empty = () => new Response("", { headers: { "Content-Type": "text/javascript" } });
    event.respondWith(fetch(req).then((r) => (r.ok ? r : empty())).catch(empty));
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const cached = await cache.match(req, { ignoreSearch: true });
    // "no-cache" makes the browser check with the server instead of trusting its
    // own HTTP cache, so a newly published version shows up on the next open.
    const network = fetch(req.url, { cache: "no-cache" }).then((res) => {
      if (res.ok) cache.put(req, res.clone());
      return res;
    });
    if (!cached) return network;
    network.catch(() => {}); // a late failure is fine once the cached copy is served
    const timeout = new Promise((resolve) => setTimeout(() => resolve(null), NETWORK_TIMEOUT_MS));
    const fresh = await Promise.race([network.catch(() => null), timeout]);
    return fresh && fresh.ok ? fresh : cached;
  })());
});
