"use strict";
const PREF ='ekpss', CACHE = PREF+'1'
const FILES = [
  'main.html',
  'main.css',
  'main.js',
  'image/icon.png',
  'manifest.json'
]

function installCB(e) {  //CB means call-back
  console.log("installing "+CACHE);
  e.waitUntil(
    caches.open(CACHE)
    .then(cache => cache.addAll(FILES))
    .catch(console.log)
  )
}
addEventListener('install', installCB)

function save(req, resp) {
  //if (no need to cache) return resp;
  return caches.open(CACHE)
  .then(cache => { // save request
    cache.put(req, resp.clone());
    return resp;
  }) 
  .catch(console.err)
}
function report(req) {
  console.log(CACHE+' matches '+req.url)
  return req
}
function fetchCB(e) { //fetch first
  let req = e.request
  e.respondWith(
    fetch(req).then(r2 => save(req, r2))
    .catch(() => caches.match(req).then(report))
  )
}
addEventListener('fetch', fetchCB)

function removeOld(L) {
  return Promise.all(L.map(key => {
    if (!key.startsWith(PREF) || key == CACHE)
       return null;
    console.log(key+" is deleted")
    return caches.delete(key)
  }))
}
function activateCB(e) {
  console.log(CACHE+" is activated");
  e.waitUntil(
    caches.keys().then(removeOld)
  )
}
addEventListener('activate', activateCB);
