import {IModule, IRootElementService, IScope, module} from 'angular';
import {HttpService} from "../services/http.service";
import {ModuleService} from "../services/module.service";
import {homeComponent} from "./home/home.component";
import {moduleComponent} from "./module/module.component";
import {RecordService} from "../services/record.service";
import {ErrorService} from "../errors/error.service";
import {errorComponent} from "../errors/error.component";
import {ServiceWorkerService} from "../ServiceWorker/service-worker.service";
import {environment} from "../environments/environment";
import {removeServiceWorkers} from "../ServiceWorker/registration";

class Home  {
    static requires = [require('angular-route')];
    private static module: IModule;
    static factory() {
            if(Home.module == null) {
                Home.module =
                    module('homeApp', Home.requires,
                    [
                        '$routeProvider', '$locationProvider', ($routeProvider: any, $locationProvider: any) => {
                        $routeProvider
                            .when('/', {
                                redirectTo: '/home'
                                ,controller: ['$rootElement', '$scope',
                                    (rootElement: IRootElementService, scope: any) => {
                                        scope["runningApp"] = rootElement.attr('ng-app').valueOf();
                                        console.log('the name of the app is', scope["runningApp"]);
                                    }]
                            })
                            .when('/home', {
                                template: '<app-home></app-home><app-error></app-error>'
                            })
                            .when('/home/:module', {
                                template: '<app-module></app-module><app-error></app-error>'
                            })
                            .otherwise(
                            {
                                redirectTo: '/home'
                                }
                            );
                        $locationProvider.html5Mode(true);
                    }])
                        .service("httpService", HttpService)
                        .service("moduleService", ModuleService)
                        .service("recordService", RecordService)
                        .service('errorService', ErrorService)
                        .factory('serviceWorkerService', ServiceWorkerService.getInstance)
                        .component('appError', errorComponent)
                        .component("appHome", homeComponent)
                        .component("appModule", moduleComponent)
                        .run(['$rootScope',
                            (rootScope: any) => {
                                rootScope.runningApp = "home";
                            }])

            }
            return 'homeApp';
    }
}

export default function homeApp() {
    return Home.factory();
}
