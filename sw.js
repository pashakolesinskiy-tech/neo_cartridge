const CACHE_NAME = 'neo-cartridge-pwa-v7';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/console.css',
  './css/components.css',
  './js/app.js',
  './js/audio.js',
  './js/editor.js',
  './js/webrtc-room.js',
  './js/p2p.js',
  './js/previews.js',
  './js/storage.js',
  './js/pwa.js',
  './assets/favicon.svg',
  './assets/logo.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
];

const OFFLINE_GAME_ASSETS = [
  './games/stick_fighting.html',
  './games/stick_fighting_assets/fighter_vortex.png',
  './games/stick_fighting_assets/vfx_props.png',
  './games/pixel_drift.html',
  './games/chrono_blade.html',
  './games/mecha_siege.html',
  './games/worms_armageddon.html',
  './games/cosmo_junk.html',
  './games/worms-armageddon/assets/worms-sheet.png',
  './games/worms-armageddon/assets/items-sheet.png',
  './games/worms-armageddon/assets/plane.png',
  './games/cosmo-junk-game-concept/standalone/assets/app.js',
  './games/cosmo-junk-game-concept/standalone/assets/app.css',
  './games/cosmo-junk-game-concept/standalone/assets/icon.svg',
  './games/sprites/pixel_drift_sheet.png',
  './games/sprites/chrono_blade_sheet.png',
  './games/sprites/mecha_siege_sheet.png',
  './games/sprites/cosmo_junk_sheet.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        CORE_ASSETS.map((asset) => cache.add(asset))
      );
      if (!self.registration.active) {
        await self.skipWaiting();
      }
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(async (keys) => {
      await Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
      await self.clients.claim();
    })
  );
});

function isShellDocumentOrCode(request, url) {
  if (request.mode === 'navigate') return true;
  return /\.(?:html|css|js|webmanifest)$/i.test(url.pathname);
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch {
    return;
  }

  if (url.origin !== self.location.origin) return;
  if (url.pathname.includes('/api/')) return;

  if (isShellDocumentOrCode(request, url)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
          const networkRes = await fetch(request);
          if (networkRes && networkRes.ok && networkRes.type === 'basic') {
            cache.put(request, networkRes.clone()).catch(() => {});
          }
          return networkRes;
        } catch {
          return (
            (await cache.match(request)) ||
            (await cache.match(request, { ignoreSearch: true })) ||
            (request.mode === 'navigate'
              ? (await cache.match('./index.html')) || (await cache.match('./'))
              : null) ||
            new Response('', { status: 504, statusText: 'Offline' })
          );
        }
      })()
    );
    return;
  }

  // Binary images / sprites / icons: Stale-While-Revalidate
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached =
        (await cache.match(request)) ||
        (await cache.match(request, { ignoreSearch: true }));
      const networkFetch = fetch(request)
        .then((res) => {
          if (res && res.ok && res.type === 'basic') {
            cache.put(request, res.clone()).catch(() => {});
          }
          return res;
        })
        .catch(() => null);

      if (cached) {
        event.waitUntil(networkFetch);
        return cached;
      }

      const fresh = await networkFetch;
      return fresh || new Response('', { status: 504, statusText: 'Offline' });
    })()
  );
});

async function notifyClients(msg, sourceClient) {
  if (sourceClient && typeof sourceClient.postMessage === 'function') {
    sourceClient.postMessage(msg);
    return;
  }
  const clients = await self.clients.matchAll({ includeUncontrolled: true });
  for (const client of clients) {
    client.postMessage(msg);
  }
}

self.addEventListener('message', (event) => {
  const data = event.data;
  if (!data || typeof data !== 'object') return;

  if (data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (data.type === 'CACHE_ALL_GAMES') {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(CACHE_NAME);
        const list = [...CORE_ASSETS, ...OFFLINE_GAME_ASSETS];
        const total = list.length;
        let done = 0;
        let failed = 0;

        for (const asset of list) {
          try {
            const res = await fetch(asset, { cache: 'reload' });
            if (res && res.ok) {
              await cache.put(asset, res);
            } else {
              failed++;
            }
          } catch {
            failed++;
          }
          done++;
          await notifyClients(
            { type: 'PWA_CACHE_PROGRESS', done, total, failed },
            event.source
          );
        }

        await notifyClients(
          { type: 'PWA_CACHE_DONE', done, total, failed },
          event.source
        );
      })()
    );
  }
});
