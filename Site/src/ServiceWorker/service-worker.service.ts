import {BehaviorSubject, fromEventPattern, Observable, ReplaySubject} from "rxjs";
import registerWorker, {removeServiceWorkers} from "./registration";
import {map, switchMap} from "rxjs/operators";
import {environment} from "../environments/environment";

export class ServiceWorkerService {
    private static instance: ServiceWorkerService;
    private static registration$: ReplaySubject<ServiceWorkerRegistration> =
        new ReplaySubject<ServiceWorkerRegistration>(1);

    private static registration: ServiceWorkerRegistration;
    private updateAvailable: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    public get updateAvailable$() :Observable<boolean> {
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
    private nextWorker: any;
    private constructor() {
        this.nextWorker = null;
        ServiceWorkerService.registration$
            .pipe(switchMap(registration => {
                registration.addEventListener('controllerchange', (x:any) => {
                    console.log('HELP', x);
                });
                return this.onUpdateHandler(registration).pipe(map(res => {
                    console.log('update found????', res);
                    let newWorker = res.installing
                    console.log('setting next worker to', registration.installing);

                    this.nextWorker = registration.installing;
                    this.updateAvailable.next(true);
                }))
            }))
            .subscribe(registration => {
                console.log('I have subscribed....');
            });
    }
}
