// sw.js - Service Worker para caché de imágenes
// Colocar este archivo en la RAÍZ del proyecto (junto a index.html)

const CACHE_NAME = 'el-sabor-doblao-v1';
const CACHE_IMAGES = 'el-sabor-doblao-images-v1';

// Archivos críticos para cachear inmediatamente
const CRITICAL_ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/css/responsive.css',
    '/js/menu.js',
    '/js/cart.js',
    '/js/order.js',
    '/propertie.png'
];

// Instalar Service Worker
self.addEventListener('install', function(event) {
    console.log('Service Worker: Instalando...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Service Worker: Cacheando archivos críticos');
                return cache.addAll(CRITICAL_ASSETS.map(url => new Request(url, {cache: 'reload'})));
            })
            .catch(function(error) {
                console.error('Error al cachear archivos críticos:', error);
            })
    );
    
    self.skipWaiting();
});

// Activar Service Worker
self.addEventListener('activate', function(event) {
    console.log('Service Worker: Activando...');
    
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME && cacheName !== CACHE_IMAGES) {
                        console.log('Service Worker: Eliminando caché viejo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    
    return self.clients.claim();
});

// Interceptar peticiones
self.addEventListener('fetch', function(event) {
    const url = new URL(event.request.url);
    
    // Solo cachear recursos del mismo origen
    if (url.origin !== location.origin) {
        return;
    }
    
    // Estrategia para imágenes: Cache First, luego Network
    if (event.request.destination === 'image' || url.pathname.includes('/images/')) {
        event.respondWith(
            caches.open(CACHE_IMAGES).then(function(cache) {
                return cache.match(event.request).then(function(cachedResponse) {
                    // Si está en caché, devolverla
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    // Si no, intentar de la red y cachear
                    return fetch(event.request, {
                        mode: 'cors',
                        credentials: 'omit'
                    }).then(function(networkResponse) {
                        // Solo cachear respuestas exitosas
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(function() {
                        // Si falla, devolver placeholder si existe en caché
                        return cache.match('/assets/images/products/placeholder.jpg');
                    });
                });
            })
        );
        return;
    }
    
    // Estrategia para otros recursos: Network First, luego Cache
    event.respondWith(
        fetch(event.request)
            .then(function(response) {
                // Si la respuesta es válida, cachearla
                if (response && response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseClone);
                    });
                }
                return response;
            })
            .catch(function() {
                // Si falla la red, intentar desde caché
                return caches.match(event.request);
            })
    );
});

// Limpiar caché de imágenes cuando sea muy grande
self.addEventListener('message', function(event) {
    if (event.data.action === 'clearImageCache') {
        event.waitUntil(
            caches.delete(CACHE_IMAGES).then(function() {
                console.log('Caché de imágenes limpiada');
                return caches.open(CACHE_IMAGES);
            })
        );
    }
});
