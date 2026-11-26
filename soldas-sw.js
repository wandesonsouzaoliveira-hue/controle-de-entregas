const CACHE_NAME = "controle-soldas-pwa-v1";
const APP_SHELL = ["./soldas.html", "./soldas-manifest.webmanifest", "./soldas-icon.svg"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(key => key.startsWith("controle-soldas-") && key !== CACHE_NAME).map(key => caches.delete(key))
  )));
  self.clients.claim();
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put("./soldas.html", copy));
      }
      return response;
    }).catch(() => caches.match("./soldas.html")));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
});