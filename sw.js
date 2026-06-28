/* Offline cache for modern browsers (phones/desktop). Network-first so updates
   show immediately when online; cache is the offline fallback. Kindle's old
   browser likely ignores service workers — for guaranteed Kindle offline,
   sideload the folder and open via file://. */
var CACHE='kindle-chess-v13';
var ASSETS=['./','index.html','puzzles.html','style.css',
  'engine.js','ui.js','svg-pieces.js','pieces-animals.js','pieces-silly.js','pieces-emoji.js','puzzles-data.js','manifest.webmanifest'];
self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(ASSETS);}).then(function(){return self.skipWaiting();}));
});
self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.map(function(k){if(k!==CACHE)return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});
self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  e.respondWith(
    fetch(e.request).then(function(r){
      if(r&&r.status===200){var cp=r.clone();caches.open(CACHE).then(function(c){c.put(e.request,cp);});}
      return r;
    }).catch(function(){ return caches.match(e.request); })
  );
});
