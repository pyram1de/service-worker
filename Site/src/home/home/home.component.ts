import {IComponentOptions, IHttpService, ILocationService, IOnInit, IScope, IWindowService} from "angular";
import {ModuleService} from "../../services/module.service";
import {ServiceWorkerService} from "../../ServiceWorker/service-worker.service";

class HomeController implements IOnInit{
    modules: string[] = [];
    public updateAvailable: boolean = false;
    public version: string = '0.0.0.0'

    static $inject: string[] = [
        '$scope',
        '$window',
        'moduleService',
        '$location',
        'serviceWorkerService',
        '$http',
    ];

    constructor(
        private $scope: IScope,
        private $window: IWindowService,
        private moduleService: ModuleService,
        private $location: ILocationService,
        private serviceWorkerService: ServiceWorkerService,
        private $http: IHttpService,
    ) {
    }

    $onInit(): void {
        this.moduleService.modules.subscribe(modules => this.modules = modules);
        this.serviceWorkerService.updateAvailable$.subscribe(update => {
            if(update) {
                this.$scope.$apply(() => {
                    this.updateAvailable = true;
                });
            }
        });
    }

    public navigate(module: string) {
        this.$location.path(this.$location.path() + `/${module}`)
    }


    getSwVersion() {
        return this.serviceWorkerService.version;
    }

    public update() {
        this.serviceWorkerService.update();
    }
}


export const homeComponent: any = {
    controller: HomeController,
    styleUrl: './home.component.sass',
    template: `
        <div ng-repeat="module in $ctrl.modules">
            {{module}}
            <a ng-click="$ctrl.navigate(module)">go</a>
        </div>
        <div ng-if="$ctrl.updateAvailable">
            An update is Available <button ng-click="$ctrl.update()">Update</button>
        </div>
        <div>
            <p>hardcod3d version: 7</p>
            version: {{$ctrl.getSwVersion()}}
        </div>
    `
}
