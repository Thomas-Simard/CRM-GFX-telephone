// Service worker de CRM GFX Agenda : garde le PROGRAMME pour l'ouvrir sans réseau.
// Les données (envoi chiffré de l'ordinateur, importé depuis OneDrive) ne passent jamais par ici.
const CACHE = 'crm-gfx-6708bb6f4771';
const FICHIERS = ['./', 'index.html', 'manifest.webmanifest', 'icone-180.png', 'icone-192.png', 'icone-512.png'];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => { e.waitUntil(caches.keys().then(l => Promise.all(l.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if(e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  // Le réseau d'abord (toujours la dernière version), la copie si hors ligne.
  e.respondWith(fetch(e.request).then(r => { const copie = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copie)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
