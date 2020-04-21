import {HttpService} from "./http.service";
import {Observable} from "rxjs";

export class ModuleService {
    static $inject: string[] = ['httpService']
    constructor(private httpService: HttpService) {
        
    }
    
    get modules() :  Observable<string[]> {
        return this.httpService.get('modules');
    }
}
