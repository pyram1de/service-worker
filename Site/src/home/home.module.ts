import { module } from 'angular';

class Home  {
    static requires = [require('angular-route')];
    private static module: any;
    static factory() {
            if(Home.module == null) {
                console.log('goodbye')
                Home.module = module('homeApp', Home.requires,
                    [
                        '$routeProvider', '$locationProvider', ($routeProvider: any, $locationProvider: any) => {
                        console.log('home...')
                        $routeProvider
                            .when('/', {
                                redirectTo: '/home'
                            })
                            .when('/home', {
                                template: '<p>home works!</p>',
                            }).otherwise(
                            {
                                redirectTo: '/home'
                                }
                            );

                        $locationProvider.html5Mode(true);

                    }
                    ])
            }
            return 'homeApp';
    }
}

export default function homeApp() {
    let result = Home.factory();
    return result;
}
