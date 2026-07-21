const CACHE_NAME='el-juego-del-ni-final-2026-07-21-v245';
const SHELL=['./','./index.html','./manifest.webmanifest'];
const IMMUTABLE=["./visual-01-d8b6820c5df5.webp","./visual-02-5e5af8ec0402.webp","./visual-03-0c7ac00b297f.webp","./visual-04-e3e0a7266d21.webp","./visual-05-51b7fcf49378.webp","./visual-06-e863ec9dacfc.webp","./visual-07-fe967a297487.webp","./visual-08-113459a8d543.webp","./visual-09-8fc1a133d846.webp","./visual-10-09f99d43eec1.webp","./visual-11-a77e7b04f3f4.webp","./visual-12-bf4eaf4f0af4.webp","./visual-13-a557a3b012ed.webp","./visual-14-1fb58b256f1a.webp","./visual-15-4ef52658aa66.webp","./visual-16-39a1f9635a82.webp","./visual-17-976611038251.webp","./visual-18-0a724f1b2afe.webp","./visual-19-0f36c561be91.webp","./visual-20-baa11cb54981.webp","./visual-21-723b76674fae.webp","./visual-22-eb34dda616b5.webp","./visual-23-ab697d3702e3.webp","./visual-24-a403225b760a.webp","./visual-25-b5d2bab5a2e4.webp","./visual-26-6306541f915a.webp","./visual-27-aab92e42ed00.webp","./icons/icon-192.png","./icons/icon-512.png"];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await cache.addAll(SHELL);
    await Promise.allSettled(IMMUTABLE.map(url=>cache.add(url)));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const names=await caches.keys();
    await Promise.all(names.filter(name=>name!==CACHE_NAME).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{
  if(event.data && event.data.type==='SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin) return;
  if(event.request.mode==='navigate'){
    event.respondWith((async()=>{
      try{
        const fresh=await fetch(event.request,{cache:'no-store'});
        const cache=await caches.open(CACHE_NAME);
        cache.put('./index.html',fresh.clone());
        return fresh;
      }catch(error){
        return (await caches.match(event.request)) || (await caches.match('./index.html'));
      }
    })());
    return;
  }
  if(url.pathname.includes('/') || url.pathname.includes('/icons/')){
    event.respondWith((async()=>{
      const cached=await caches.match(event.request);
      if(cached) return cached;
      const response=await fetch(event.request);
      const cache=await caches.open(CACHE_NAME);
      cache.put(event.request,response.clone());
      return response;
    })());
  }
});
