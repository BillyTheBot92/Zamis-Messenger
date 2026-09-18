const CACHE_NAME = 'zamis-v2.5.2';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  if (e.request.url.includes('supabase') || e.request.url.includes('jsdelivr')) return;
  e.respondWith(fetch(e.request).then(r => {
    if (r && r.status === 200 && e.request.method === 'GET') {
      const clone = r.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
    }
    return r;
  }).catch(() => caches.match(e.request)));
});
