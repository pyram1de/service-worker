import {environment} from "./environments/environment";
import {SaveService} from "./ServiceWorker/Save/save.service";

const version = 'v225';

self.addEventListener('install', (event: any) => {
    console.log('INSTALLING');
   return event.waitUntil(
       caches.open(version)
           .then((cache) => {
               return cache.addAll([
                   'https://minisite.com:8080/vendors~scripts.js',
                   'https://minisite.com:8080/scripts.js',
                   'https://minisite.com:8080'
               ]);
           })
   );
});

self.addEventListener('activate', (event:any) => {
    console.log('activating new one');
    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(keys.filter((key)=> key!== version).map(key => caches.delete(key)));
            })
    );
});

self.addEventListener('fetch', (event: any) => {
    if(event.request.bodyUsed) {
        console.log('body', event.request.body)
        let reader = event.request.body.getReader();
        reader.read().then((result: any) => {
            console.log('read stream', result);
        })
    }

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
