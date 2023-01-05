const path = require("path");
const fs = require("fs");
const utils = require("./utils");

const tempPath = path.resolve(__dirname, "template/widget");
const srcPath = path.resolve(__dirname, "../src");
const widgetPath = path.resolve(srcPath, process.argv[3] || "views/widget");

var moduleName = process.argv[2];
if (!moduleName) throw "参数错误";
const className = utils.getClassName(moduleName);
(function () {
    return new Promise((resolve, reject) => {
        utils.mkdirsSync(path.resolve(widgetPath, moduleName));
        resolve();
    });
})()
    .then(() => {
        var tml = fs.readFileSync(path.resolve(tempPath, "vue"), "utf-8");
        tml = tml.replace(/\$\{className\}/g, className);

        const wpath = path.resolve(widgetPath, moduleName, `${className}.vue`);
        fs.writeFileSync(wpath, tml);
    })
    .then(() => {
        var tml = fs.readFileSync(path.resolve(tempPath, "vue_ts"), "utf-8");
        tml = tml.replace(/\$\{className\}/g, className);

        const wpath = path.resolve(widgetPath, moduleName, `${className}.ts`);
        fs.writeFileSync(wpath, tml);
    })
    .then(() => {
        const wpath = path.resolve(widgetPath, moduleName, `${className}.vue.html`);
        fs.writeFileSync(wpath, "");
    })
    .then(() => {
        const wpath = path.resolve(widgetPath, moduleName, `${className}.vue.scss`);
        fs.writeFileSync(wpath, "");
    })
    .then(() => {
        console.log("done!");
    });
