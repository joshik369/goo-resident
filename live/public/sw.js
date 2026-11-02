// Authenticated records, responses, and activation pages are never cached.
const CACHE='goo-live-shell-v1';
const ASSETS=['/style.css','/login.css','/live.css','/client.js','/forms.json','/icon.svg','/icon-192.png','/icon-512.png','/manifest.webmanifest'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim()});
self.addEventListener('fetch',event=>{const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==self.location.origin||url.pathname.startsWith('/api/'))return;if(ASSETS.includes(url.pathname))event.respondWith(fetch(event.request).catch(()=>caches.match(url.pathname)));else if(event.request.mode==='navigate')event.respondWith(fetch(event.request).catch(()=>new Response('<h1>Goo Resident</h1><p>Connect to the internet to sign in and access your private records.</p>',{headers:{'Content-Type':'text/html'}})))});
