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
                let filesToCache = swGlobalCacheAssets.concat(cached_files);
                console.log('files to cache', filesToCache);
                return cache.addAll(filesToCache);
            })
            .catch(error => {
                console.error(error)
                throw error
            })
    )
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
        return self.skipWaiting();
    }
})

self.addEventListener('fetch', (event: FetchEvent) => {
    const req = event.request;
    networkRequestFallBackToCache(event);
});

function networkRequestFallBackToCache(event: FetchEvent) : void {
    event.respondWith(
        fetchAndUpdateCache(event)
    );
}

function fetchAndUpdateCache(event: FetchEvent) : Promise<Response> {
    return fetch(event.request)
        .then(
            (res: Response) => {
                return caches.open(version).then(
                    (cache) => {
                        if (!res.ok) {
                            return cache.match(event.request).then(result => {
                                if(!result) {
                                    return Promise.reject("not found in cache");
                                }
                                return Promise.resolve(result);
                            });
                        } else {
                            cache.put(event.request, res.clone());
                            return res;
                        }
                    })
        });
}

const broadcast = new BroadcastChannel('service-worker-broadcast');

broadcast.onmessage = (event) => {
    switch(event.data.payloadType) {
        case 'request-version':
            broadcast.postMessage({
                payload: version,
                payloadType: 'version'
            })
    }
}
