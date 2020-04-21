import {IHttpService} from "angular";
import {Observable, from, of} from "rxjs";
import {catchError, map, retry} from "rxjs/operators";
import {ErrorService} from "../errors/error.service";
import {environment} from "../environments/environment";

export class HttpService {
    private host = environment;
    static $inject = ['$http', 'errorService'];
    constructor(private http: IHttpService, private errorService: ErrorService) {
    }

    get(url: string) : Observable<string[]> {
        return from(this.http.get<string[]>(`${this.host}/${url}`))
                .pipe(
                    map(result => result.data),
                    retry(2),
                    this.handleError);
    }

    post(url: string, data: any) : Observable<any> {
        return from(this.http.post(`${this.host}/${url}`, data))
                .pipe(
                    map(result => result.data),
                    this.handleError,
                    retry(2));
    }

    put(url: string, data: any) : Observable<any> {
        return from(this.http.put(`${this.host}/${url}`, data))
                .pipe(
                    map(result => result.data),
                    this.handleError,
                    retry(2));
    }

    private handleError = catchError((err, caught) => {
        this.errorService.logError({
            error: err,
            caught: caught
        }, "error");
        return of(err);
    });
}
