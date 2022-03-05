var cacheName = 'weatherPWA-v1';
var filesToCache = [
    '/',
    'index.html',
    'app.js',
    '/scripts/localforage-1.4.0.js',
    'ud811.css',
    'images/clear.png',
    'images/cloudy-scattered-showers.png',
    'images/cloudy.png',
    'images/fog.png',
    'images/ic_add_white_24px.svg',
    'images/ic_refresh_white_24px.svg',
    'images/partly-cloudy.png',
    'images/rain.png',
    'images/scattered-showers.png',
    'images/sleet.png',
    'images/snow.png',
    'images/thunderstorm.png',
    'images/wind.png'
];

//Añade un event listener en la app que nos avisa cuando el
//service worker esta instalado. Entonces el service worker 
//guarda el app shell de la app en el cache para que pueda
// ser visto sin conexion.
self.addEventListener('install', function(e) {
    console.log('[ServiceWorker] Install');
    e.waitUntil(
        caches.open(cacheName).then(function(cache) {
            console.log('[ServiceWorker] Caching app shell');
            return cache.addAll(filesToCache);
        })
    );
});

// Un event listener que activa el service worker y busca por
//cache antiguo para eliminarlo.
self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

//Este event listener se activa cuando el service
//worker realiza una peticion a algo en la red y con
//la funcion respond with podemos manejar la respuesta
//a la peticion por nuestra cuenta.
self.addEventListener('fetch', function(e) {
    console.log('[ServiceWorker] Fetch', e.request.url);
    e.respondWith(
        caches.match(e.request).then(function(response) {
            return response || fetch(e.request);
        })
    );
});