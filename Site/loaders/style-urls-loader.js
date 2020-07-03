module.exports = function(source) {
    const regex = /styleUrl:[\s]*["'](?<url>.+\.(less|sass))["']+/g;
    source = source.replace(regex, "styleUrl: require('$1')");
    return source;
};
