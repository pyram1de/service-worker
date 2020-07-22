import {BehaviorSubject, fromEventPattern, NEVER, Observable, ReplaySubject} from "rxjs";
import registerWorker, {removeServiceWorkers} from "./registration";
import {filter, map, switchMap} from "rxjs/operators";
import {environment} from "../environments/environment";

export class ServiceWorkerService {
    private static instance: ServiceWorkerService;
    private static registration$: ReplaySubject<ServiceWorkerRegistration> =
        new ReplaySubject<ServiceWorkerRegistration>(1);

    private static registration: ServiceWorkerRegistration;
    private updateAvailable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    public version: string = '';

    public get updateAvailable$() :Observable<boolean> {
        if(environment.features.serviceWorkerAutoUpdate) {
            return NEVER;
        }
        return this.updateAvailable.asObservable();
    }

    public update() : void {
        if(ServiceWorkerService.registration.waiting) {
            ServiceWorkerService.registration.waiting.postMessage('skipWaiting')
        }
    }

    public static getInstance(): ServiceWorkerService {
        if(environment.features.serviceWorker) {
            registerWorker().then((registration: ServiceWorkerRegistration) => {
                if(registration) {
                    ServiceWorkerService.registration = registration;
                    ServiceWorkerService.registration$.next(ServiceWorkerService.registration);
                }
            });
        } else {
            removeServiceWorkers()
                .then(() => {
                    console.log('successfully removed service workers');
                })
                .catch((err) => {
                    console.log('could not remove service workers');
                })
        }
        if(!ServiceWorkerService.instance) {
            ServiceWorkerService.instance = new ServiceWorkerService();
        }
        return ServiceWorkerService.instance;
    }

    private onUpdateHandler(registration: ServiceWorkerRegistration): Observable<any> {
        const addOnUpdateHandler = (handler: EventListenerOrEventListenerObject) => {
            registration.addEventListener('updatefound', handler);
        }
        const removeOnUpdateHandler = (handler: EventListenerOrEventListenerObject) => {
            registration.removeEventListener('updatefound', handler);
        }
        return fromEventPattern(addOnUpdateHandler, removeOnUpdateHandler);
    }

    private onStateChangeHandler(serviceWorker: ServiceWorker) {
        const addOnStateChangedHandler = (handler: EventListenerOrEventListenerObject) => {
           serviceWorker.addEventListener('statechange', handler);
        };
        const removeOnStateChangedHandler = (handler: EventListenerOrEventListenerObject) => {
          serviceWorker.removeEventListener('statechange', handler);
        };
        return fromEventPattern(addOnStateChangedHandler, removeOnStateChangedHandler);
    }

    private nextWorker: any;
    private constructor() {
        const broadcastChannel = new BroadcastChannel('service-worker-broadcast');

        broadcastChannel.onmessage = (event) => {
            switch(event.data.payloadType) {
                case 'version':
                    this.version = event.data.payload;
                    break;
            }
        }

        broadcastChannel.postMessage({
            payloadType: 'request-version',
        })

        this.nextWorker = null;
        ServiceWorkerService.registration$
            .pipe(switchMap(registration => {
                return this.onUpdateHandler(registration).pipe(switchMap(() => {
                    this.nextWorker = registration.installing;
                    return this.onStateChangeHandler(this.nextWorker).pipe(map((event) => {
                        if(this.nextWorker.state === 'installed') {
                            this.updateAvailable.next(true);
                        }
                    }))
                }))
            }))
            .subscribe(() => {});

        this.updateAvailable.asObservable()
                .pipe(filter(available => available === true))
                .subscribe(() => {
            if(environment.features.serviceWorkerAutoUpdate) {
                this.update();
            }
        });
    }
}
