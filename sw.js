// Service worker CIBLE Produksi: jaringan dulu, cadangan dari cache (agar aplikasi tetap terbuka saat offline).
const V='cible-prod-v1',SHELL=['./','index.html','config.js','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const h=new URL(r.url).hostname;
 if(h==='script.google.com'||h.endsWith('googleusercontent.com'))return; // data produksi selalu diambil online
 e.respondWith(fetch(r).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})
  .catch(()=>caches.match(r).then(m=>m||(r.mode==='navigate'?caches.match('index.html'):Response.error()))))});
