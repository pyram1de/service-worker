import { bootstrap } from 'angular';
import { default as home } from "./home/home.module";

import './ServiceWorker/registration';

bootstrap(document, [
    home()
]);

