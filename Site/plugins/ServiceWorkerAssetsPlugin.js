const fs = require('fs');
const ConcatSource = require("webpack-sources").ConcatSource;

class ServiceWorkerAssetsPlugin {
    options = {
        exclude: null,
        additionalIncludes: []
    };
    constructor(options) {
        this.options = Object.assign({
                exclude:  /\.js.map?$|sw.js/,
                additionalIncludes: []
            },
            options
        )
    }
    apply(compiler) {

        compiler.hooks.done.tap(this.constructor.name, (stats) => {
           console.log('hashy', stats.hash);
        });

        compiler.hooks.entryOption.tap(this.constructor.name, (context, entry) => {
           console.log('ha', entry, context);
        });

        compiler.hooks.emit.tapAsync(this.constructor.name, (compilation, callback) => {
            console.log('hello dave...');

           // compilation.addModule('sw.ts');

           // console.log(compilation.assets['sw.ts'])

           callback();
        });

        // emit is asynchronous hook, tapping into it using tapAsync, you can use tapPromise/tap(synchronous) as well

        compiler.hooks.emit.tapAsync(this.constructor.name, (compilation, callback) => {
            // Create a header string for the generated file:
            var filelist = '(function() {self.swGlobalCacheAssets = [';


            // Loop through all compiled assets,
            // adding a new line item for each filename.
            if(this.options.exclude) {
                for(let filename in compilation.assets) {
                    //console.log('file', file);
                    if(filename.match(this.options.exclude)) {
                        break;
                    }
                    filelist += `'${filename}',`
                }
            }

            filelist += '];})();';

            compilation.updateAsset('sw.js', (x) => {
                //x.node().children().replace('--source-files--', 'test')
                //x = x.source().replace('--source-files--', 'test');
                console.log(x.sourceAndMap())
                return new ConcatSource(filelist, '\n', x)
            }, )

            callback();
        });

    }
}

module.exports = ServiceWorkerAssetsPlugin;
