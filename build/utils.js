// 首字大写
String.prototype.firstUpperCase = function() {
    return this.replace(/^\S/, function(s) {
        return s.toUpperCase();
    })
}

var path = require("path");
var fs = require("fs");
// 创建文件夹
function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
// 协议名
function getPName(p) {
    p = p.replace(/\//g, "_");
    p = p.replace(/_\{(.*?)\}/g, "_var");
    if (p.indexOf("_") == 0) p = p.substr(1);
    return p;
}

// 生成类名
function getClassName(pName) {
    return pName.split("_").map(value => value.firstUpperCase()).join("");
}

module.exports = { mkdirsSync, getPName, getClassName };
