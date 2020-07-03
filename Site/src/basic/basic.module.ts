import {IModule, IRootElementService, IScope, module} from 'angular';
import {errorComponent} from "../errors/error.component";

class Basic  {
    static requires = [require('angular-route')];
    private static module: IModule;
    static factory() {
        if(Basic.module == null) {
            Basic.module =
                module('homeApp', Basic.requires,
                    [
                        '$routeProvider', '$locationProvider', ($routeProvider: any, $locationProvider: any) => {
                        $routeProvider
                            .when('/', {
                                redirectTo: '/home'
                            })
                            .when('/basic', {
                                template: `<div>visual... basic</div>`
                            })
                            .otherwise(
                                {
                                    redirectTo: '/basic'
                                }
                            );
                        $locationProvider.html5Mode(true);
                    }])
                    .component('appError', errorComponent)
                    .run(['$rootScope',
                        (rootScope: any) => {
                            rootScope.runningApp = "basic";
                        }])

        }
        return 'homeApp';
    }
}

export default function basicApp() {
    return Basic.factory();
}
