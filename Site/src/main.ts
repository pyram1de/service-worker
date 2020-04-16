import { bootstrap } from 'angular';
import { default as home } from "./home/home.module";

bootstrap(document, [
    home()
]);

