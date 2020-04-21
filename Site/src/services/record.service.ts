import {HttpService} from "./http.service";
import {Observable} from "rxjs";

export class RecordService {
    static $inject: string[] = ['httpService'];
    constructor(private httpService: HttpService) {

    }

    newRecord() : Observable<any> {
        return this.httpService.post('record', null);
    }

    updateRecord(record: any) : Observable<any> {
        return this.httpService.put('record', record);
    }

}
