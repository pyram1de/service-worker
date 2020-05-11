import { bootstrap } from 'angular';
import { default as home } from "./home/home.module";
import './styles.sass';

bootstrap(document, [
    home()
]);



