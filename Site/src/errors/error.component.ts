import {IComponentOptions, IOnInit} from "angular";
import {ErrorService} from "./error.service";
import {map} from "rxjs/operators";

class ErrorController implements IOnInit {
    currentError: any;

    static $inject: string[] = ['errorService']
    constructor(private errorService: ErrorService) {

    }

    $onInit(): void {
        this.errorService.error$
            .subscribe(error => {
                this.currentError = error;
            });
    }

    close() {
        this.currentError = null;
    }

}

export const errorComponent: IComponentOptions = {
    controller: ErrorController,
    template: `
        <div ng-if="$ctrl.currentError">
            <div>An Error Occurred</div>
            <div>
                {{$ctrl.currentError.message}}
            </div>
            <div><button ng-click="$ctrl.close()">close</button></div>
        </div>
    `
}
