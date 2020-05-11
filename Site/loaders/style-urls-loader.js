module.exports = function(source) {
    this.cacheable();
    const regex = /styleUrl:[\s]*["'](?<url>.+\.less)["']+/g;
    source = source.replace(regex, "styleUrl: require('$1')");
    return source;
};
