import {fromEventPattern, Observable, ReplaySubject} from "rxjs";
import {default as registerWorker} from "./registration";
import {filter, switchMap} from "rxjs/operators";
import {fromPromise} from "rxjs/internal-compatibility";


export class ServiceWorkerService {
    private static instance: ServiceWorkerService;
    private static worker$: ReplaySubject<ServiceWorkerRegistration> =
        new ReplaySubject<ServiceWorkerRegistration>(1);

    private static worker: ServiceWorkerRegistration;

    public get updateAvailable$() :Observable<any> {
        return ServiceWorkerService.worker$.pipe(
                filter(worker => worker!=null),
                switchMap(() =>
                    fromEventPattern(ServiceWorkerService.addOnUpdateHandler, ServiceWorkerService.removeOnUpdateHandler)
                )
            );
    }

    public update() : Observable<void> {
        return fromPromise(ServiceWorkerService.worker.update());
    }

    public static getInstance(): ServiceWorkerService {
        registerWorker().then((serviceWorker: ServiceWorkerRegistration) => {
            if(serviceWorker) {
                ServiceWorkerService.worker = serviceWorker;
                ServiceWorkerService.worker$.next(ServiceWorkerService.worker);
            }
        });
        if(!ServiceWorkerService.instance) {
            ServiceWorkerService.instance = new ServiceWorkerService();
        }
        return ServiceWorkerService.instance;
    }
    private static addOnUpdateHandler(handler: EventListenerOrEventListenerObject) {
        let worker = ServiceWorkerService.worker;
        worker.addEventListener('updatefound', handler)
    }

    private static removeOnUpdateHandler(handler: EventListenerOrEventListenerObject) {
        let worker = ServiceWorkerService.worker;
        worker.removeEventListener('updatefound', handler);
    }

    private constructor() {}

}
