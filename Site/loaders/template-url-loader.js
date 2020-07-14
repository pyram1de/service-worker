module.exports = function(source, sourceMap) {
    this.cacheable();
    const regex = /templateUrl:[\s]*["'](?<url>.+\.html)["']+/g;
    source = source.replace(regex, "template: require('$1')");
    this.callback(null, source, sourceMap);
};
