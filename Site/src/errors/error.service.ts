import {Observable, Subject} from "rxjs";

export class ErrorService {
    private _error$: Subject<any> = new Subject<any>();

    constructor() {
    }

    logError(error: any, message: string) {
        console.log('err', error);
        this._error$.next({
            error: error,
            message: message
        });
    }

    get error$() : Observable<any> {
        return this._error$.asObservable();
    }
}
