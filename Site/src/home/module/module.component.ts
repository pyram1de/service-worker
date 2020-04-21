import {IComponentOptions} from "angular";
import {RecordService} from "../../services/record.service";

class ModuleController {
    module: string = "";
    record: any;
    static $inject: string[] = ['$route', 'recordService'];
    constructor(private $route: any, private recordService: RecordService) {
        this.module = this.$route.current.params.module;
    }
    createRecord() {
        this.recordService.newRecord().subscribe(record => {
            this.record = record;
        });
    }

    updateRecord() {
        this.recordService.updateRecord(this.record).subscribe((record: any) => {
           this.record = record;
        });
    }
}

export const moduleComponent : IComponentOptions = {
    template: `
        <p>lets create a new record</p>
        <button ng-click="$ctrl.createRecord()">new</button>
        <div ng-if="$ctrl.record">
            <div class="the-inspector">
                <div>{{$ctrl.record.status}}</div>
            </div>
            <div class="the-main-body">
                <div>
                    check 1<input type="checkbox" ng-model="$ctrl.record.check1" />
                </div>
                <div>
                    check 2<input type="checkbox" ng-model="$ctrl.record.check2" />
                </div>
                <div>
                    check 3<input type="checkbox" ng-model="$ctrl.record.check3" />
                </div>
            </div>
            <button ng-click="$ctrl.updateRecord()">save</button>
        </div>        
    `,
    controller: ModuleController
}
