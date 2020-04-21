import {IComponentOptions, ILocationProvider, ILocationService, IOnInit} from "angular";
import {ModuleService} from "../../services/module.service";

class HomeController implements IOnInit{
    modules: string[] = [];

    static $inject: string[] = ['moduleService', '$location'];

    constructor(private moduleService: ModuleService, private $location: ILocationService) {
    }

    $onInit(): void {
        this.moduleService.modules.subscribe(modules => this.modules = modules);
    }

    navigate(module: string) {
        this.$location.path(this.$location.path() + `/${module}`)
    }
}


export const homeComponent: IComponentOptions = {
    controller: HomeController,
    template: `
        <div ng-repeat="module in $ctrl.modules">
            {{module}}
            <a ng-click="$ctrl.navigate(module)">go</a>
        </div>
    `
}
