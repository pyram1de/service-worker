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
                console.log('version on the cache', version, cache);
                let filesToCache = swGlobalCacheAssets.concat(cached_files);
                console.log('files to cache', filesToCache);
                return cache.addAll(filesToCache);
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
    return self.clients.claim()
});

self.addEventListener('message', messageEvent => {
    if(messageEvent.data === 'skipWaiting') {
        return self.skipWaiting()
    }
})

self.addEventListener('fetch', (event: FetchEvent) => {
    const req = event.request;
    return event.respondWith(
        caches.match(event.request)
            .then((res:any) => {
                if (res)
                    return res;

                if (!navigator.onLine) {
                    if (event.request.url === environment.host + '/modules') {
                        return new Response('["AC", "AI", "PASS"]', {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }
                    if (event.request.url === environment.host + '/record') {
                        if (event.request.method === 'POST') {
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
                        if (event.request.method === 'PUT') {
                            const body = event.request.body;
                            if (body !== undefined) {

                                return new Response(
                                    JSON.stringify(SaveService.save(body)), {
                                        headers: {
                                            'Content-Type': 'application/json',
                                        }
                                    });
                            }
                        }
                    }
                    console.log('not online and no cache', event.request);
                }
                if (
                    req.method === 'GET' &&
                    req.mode === 'navigate' &&
                    req.destination === 'document') {
                    console.log('THE REQUEST', event.request);
                    return caches.match('./').then((result) => {
                        console.log('RESULT', result);
                        return result;
                    });
                }

                // network first

                return networkRequestFallBackToCache(event)
                    .catch((err: any) => {
                        console.log('ERROR!!', err);
                        if(event.request.url === environment.host + '/modules') {
                            return new Response('["AC", "AI", "PASS"]', {
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            });
                        }
                    })

            }));});

/*
                return fetch(event.request).catch(err => {
                    if(event.request.url === environment.host + '/modules') {
                        return new Response('["AC", "AI", "PASS"]', {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });
                    }
                });
            })
    )

})
*/
function networkRequestFallBackToCache(event: FetchEvent) : Promise<Response | undefined> {
    try {
        return fetchAndUpdate(event.request);
    } catch (err) {
        return caches.match(event.request);
    }
    return Promise.reject("something else happened");

    /*
    return event.respondWith(() => {
        try {
            return fetchAndUpdate(event.request);
        } catch (err) {
            return caches.match(event.request).then((res: any) => {
                if (res !== undefined) {
                    return res;
                }
                return Promise.reject("nothing in the cache");
            });
        }
        return Promise.reject("something else happened");
    });*/
}

function fetchAndUpdate(request: Request) : Promise<Response> {
    return fetch(request)
        .then(function (res: Response) {
            if(res) {
                return caches.open(version)
                    .then(function (cache) {
                        return cache.put(request, res.clone())
                            .then(function () {
                                return res
                            })
                    })
            } else {
                return Promise.reject("no response received?")
            }
        })
}

