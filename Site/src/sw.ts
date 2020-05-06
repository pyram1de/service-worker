import {SaveService} from "./ServiceWorker/Save/save.service";
import {environment} from "./environments/environment";

const version = '$$version$$'

declare var self: ServiceWorkerGlobalScope;


declare var swGlobalCacheAssets: string[];

const cached_files =
    [
        'index.html',
        './'
    ];

self.addEventListener('install', (event: any) => {
    event.waitUntil(
        caches
            .open(version)
            .then(cache => {
                return cache.addAll(swGlobalCacheAssets.concat(cached_files))
            })
            .catch(error => {
                console.error(error)
                throw error
            })
    )
    /*
   return event.waitUntil(
       caches.open(version)
           .then((cache) => {
               return cache.addAll([
                   //'https://minisite.com:8080/vendors~scripts.js',
                   //'https://minisite.com:8080/scripts.js',
                   //'https://minisite.com:8080',
                   spa_index
               ]);
           })
   );*/
});

self.addEventListener('activate', (event:any) => {
    event.waitUntil(
        caches.keys().then((cacheNames: any) => {
            return Promise.all(
                cacheNames.map((cacheName: any) => {
                    // Delete the caches that are not the current one.
                    if (cacheName.indexOf(version) === 0) {
                        return null
                    }

                    return caches.delete(cacheName)
                })
            )
        })
    )
});

self.addEventListener('message', messageEvent => {
    if(messageEvent.data === 'skipWaiting') {
        self.skipWaiting()
        self.clients.claim()
    }
})

self.addEventListener('fetch', (event: any) => {
    const req = event.request;
    return event.respondWith(
        caches.match(event.request)
            .then((res:any) => {
                if(res)
                    return res;

                if(!navigator.onLine)
                {
                    if(event.request.url === environment.host + '/modules') {
                        return new Response('["AC", "AI", "PASS"]', {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }
                    if(event.request.url === environment.host + '/record') {
                        if(event.request.method === 'POST') {
                            return new Response(
                                JSON.stringify(
                                    {
                                        id: -1,
                                        status: 'new',
                                        check1: null,
                                        check2: null,
                                        check3: null
                                    }
                                ), {
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                });
                        }
                        if(event.request.method === 'PUT') {
                            const body = event.request.body;
                            return new Response(
                                JSON.stringify(SaveService.save(JSON.parse(body))), {
                                    headers: {
                                        'Content-Type': 'application/json',
                                    }
                                });
                        }
                    }
                    console.log('not online and no cache', event.request);
                }

                return fetch(event.request);
            })
    )
})


/*
self.addEventListener('fetch', event => {
    const request = event.request

    // Ignore not GET request.
    if (request.method !== 'GET') {
        if (DEBUG) {
            console.log(`[SW] Ignore non GET request ${request.method}`)
        }
        return
    }

    const requestUrl = new URL(request.url)

    // Ignore difference origin.
    if (requestUrl.origin !== location.origin) {
        if (DEBUG) {
            console.log(`[SW] Ignore difference origin ${requestUrl.origin}`)
        }
        return
    }

    const resource = global.caches.match(request).then(response => {
        if (response) {
            if (DEBUG) {
                console.log(`[SW] fetch URL ${requestUrl.href} from cache`)
            }

            return response
        }

        // Load and cache known assets.
        return fetch(request)
            .then(responseNetwork => {
                if (!responseNetwork || !responseNetwork.ok) {
                    if (DEBUG) {
                        console.log(
                            `[SW] URL [${requestUrl.toString()}] wrong responseNetwork: ${
                                responseNetwork.status
                            } ${responseNetwork.type}`
                        )
                    }

                    return responseNetwork
                }

                if (DEBUG) {
                    console.log(`[SW] URL ${requestUrl.href} fetched`)
                }

                const responseCache = responseNetwork.clone()

                global.caches
                    .open(CACHE_NAME)
                    .then(cache => {
                        return cache.put(request, responseCache)
                    })
                    .then(() => {
                        if (DEBUG) {
                            console.log(`[SW] Cache asset: ${requestUrl.href}`)
                        }
                    })

                return responseNetwork
            })
            .catch(() => {
                // User is landing on our page.
                if (event.request.mode === 'navigate') {
                    return global.caches.match('./')
                }

                return null
            })
    })

    event.respondWith(resource)
})*/

