module.exports = function(source, sourceMap) {
    this.cacheable();
    const regex = /styleUrl:[\s]*["'](?<url>.+\.(less|scss))["']+/g;
    source = source.replace(regex, "styleUrl: require('$1')");
    this.callback(null, source, sourceMap);
};
