import { bootstrap } from 'angular';
import { default as home } from "./home/home.module";
import { default as basic } from './basic/basic.module';
import './styles.sass';

let app = 'home';

if(app === 'home') {
    bootstrap(document, [
        home()
    ]);
}
if(app === 'basic') {
    bootstrap(document, [
        basic()
    ]);
}



