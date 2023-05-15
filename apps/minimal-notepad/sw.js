const cacheName = "v1"
self.addEventListener("install", async () => {
    self.skipWaiting();
    let cache = await caches.open(cacheName);
    await cache.addAll([
        ".",
        "./idb-7.1.1.js",
        "./index.html",
        "./style.css",
        "./main.js",
        "./sw.js",
    ]);
});

self.addEventListener("activate", async () => {
    clients.claim();
    const _caches = await caches.keys();
    const toDelete = _caches.filter(n => n !== cacheName);
    await Promise.all(toDelete.map(n => caches.delete(n)));
});

self.addEventListener("fetch", e => {
    e.respondWith(caches.match(e.request));
});
