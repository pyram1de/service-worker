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
        compiler.hooks.emit.tapAsync(this.constructor.name, (compilation, callback) => {
            var filelist = '(function() {self.swGlobalCacheAssets = [';

            if(this.options.exclude) {
                for(let filename in compilation.assets) {
                    if(filename.match(this.options.exclude)) {
                        break;
                    }
                    filelist += `'${filename}',`
                }
            }

            filelist += '];})();';

            compilation.updateAsset('sw.js', (x) => {
                return new ConcatSource(filelist, '\n', x)
            }, )

            callback();
        });
    }
}

module.exports = ServiceWorkerAssetsPlugin;
