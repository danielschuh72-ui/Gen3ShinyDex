const C='shinydex-v3';
const CORE=['./','index.html','Shiny Hunter.dc.html','gen3-data.js','maps.js','spr-maps.js','spr-g3.js','spr-g3s.js','spr-g3b.js','spr-g3bs.js','spr-g3rs.js','spr-g3fr.js','ios-frame.jsx','support.js','manifest.json','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{try{if(resp&&(resp.ok||resp.type==='opaque')){const cp=resp.clone();caches.open(C).then(c=>c.put(e.request,cp));}}catch(_){}
return resp;}).catch(()=>r)));});
