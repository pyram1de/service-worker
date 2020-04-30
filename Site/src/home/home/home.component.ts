import {IComponentOptions, ILocationService, IOnInit, IScope} from "angular";
import {ModuleService} from "../../services/module.service";
import {ServiceWorkerService} from "../../ServiceWorker/service-worker.service";

class HomeController implements IOnInit{
    modules: string[] = [];
    public updateAvailable: boolean = false;

    static $inject: string[] = [
        '$scope',
        'moduleService',
        '$location',
        'serviceWorkerService'];

    constructor(
        private $scope: IScope,
        private moduleService: ModuleService,
        private $location: ILocationService,
        private serviceWorkerService: ServiceWorkerService
    ) {
    }

    $onInit(): void {
        this.moduleService.modules.subscribe(modules => this.modules = modules);
        this.serviceWorkerService.updateAvailable$.subscribe(update => {
            console.log('update available', update);
            this.$scope.$apply(() => {
                this.updateAvailable = true;
            });
        })
    }

    public navigate(module: string) {
        this.$location.path(this.$location.path() + `/${module}`)
    }

    public update() {
        this.serviceWorkerService.update().subscribe(() => {
            console.log('updated....');
        });
    }
}


export const homeComponent: IComponentOptions = {
    controller: HomeController,
    template: `
        <div ng-repeat="module in $ctrl.modules">
            {{module}}
            <a ng-click="$ctrl.navigate(module)">go</a>
        </div>
        <div ng-if="$ctrl.updateAvailable">
            An update is Available <button ng-click="$ctrl.update()">Update</button>
        </div>
    `
}
