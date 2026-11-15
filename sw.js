const CACHE_PREFIX = "elvani-tuning-";
const CACHE_NAME = `${CACHE_PREFIX}v5`;

// Bump CACHE_NAME when you publish new versions of these files.
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./chatbot.js",
  "./i18n.js",
  "./cookie-consent.js",
  "./legal.js",
  "./vehicles.js",
  "./manifest.json",
  "./privacy.html",
  "./cookie-policy.html",
  "./terms.html",
  "./translations/sq.json",
  "./translations/en.json",
  "./translations/sr.json",
  "./assets/logo/logo.png",
  "./assets/img/bg.png",
  "./assets/img/fotografia.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/icon-512-maskable.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames
        .filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      try {
        // Revalidate HTML so a cached page does not prevent published updates.
        const response = await fetch(request, { cache: "no-cache" });
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch (error) {
        return (await cache.match(request, { ignoreSearch: true }))
          || (await cache.match(new URL("./index.html", self.registration.scope).href))
          || new Response("You are offline and this page is not available yet.", {
            status: 503,
            statusText: "Offline"
          });
      }
    })());
    return;
  }

  const isStaticAsset = ["style", "script", "image", "font", "manifest"].includes(request.destination);
  if (!isStaticAsset) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  })());
});
