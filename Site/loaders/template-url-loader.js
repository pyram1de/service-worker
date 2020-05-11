module.exports = function(source) {
    this.cacheable();
    const regex = /templateUrl:[\s]*["'](?<url>.+\.html)["']+/g;
    source = source.replace(regex, "template: require('$1')");
    return source;
};
