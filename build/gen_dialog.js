const path = require("path");
const fs = require("fs");
const utils = require("./utils");

const tempPath = path.resolve(__dirname, "template/dialog");
var srcPath = path.resolve(__dirname, "../src");

const moduleName = process.argv[2];
if (!moduleName) throw "参数错误";
if(process.argv[3]){
    console.log(">>>>>>", process.argv[3]);
    srcPath = path.resolve(srcPath, process.argv[3]);
}
const modulePath = path.resolve(srcPath, "views", moduleName);
const className = utils.getClassName(moduleName);
(function () {
    return new Promise((resolve, reject) => {
        utils.mkdirsSync(path.resolve(modulePath, "mediator"));
        utils.mkdirsSync(path.resolve(modulePath, "proxy"));
        utils.mkdirsSync(path.resolve(modulePath, "views"));
        resolve();
    });
})()
    .then(() => {
        var tml = fs.readFileSync(path.resolve(tempPath, "index"), "utf-8");
        tml = tml.replace(/\$\{className\}/g, className);

        const wpath = path.resolve(srcPath, `views/${moduleName}/index.ts`);
        fs.writeFileSync(wpath, tml);
    })
    .then(() => {
        var tml = fs.readFileSync(path.resolve(tempPath, "mediator"), "utf-8");
        tml = tml.replace(/\$\{className\}/g, className);

        const wpath = path.resolve(srcPath, `views/${moduleName}/mediator/${className}Mediator.ts`);
        fs.writeFileSync(wpath, tml);
    })
    .then(() => {
        var tml = fs.readFileSync(path.resolve(tempPath, "proxy"), "utf-8");
        tml = tml.replace(/\$\{className\}/g, className);

        const wpath = path.resolve(srcPath, `views/${moduleName}/proxy/${className}Proxy.ts`);
        fs.writeFileSync(wpath, tml);
    })
    .then(() => {
        var tml = fs.readFileSync(path.resolve(tempPath, "vue"), "utf-8");
        tml = tml.replace(/\$\{className\}/g, className);

        const wpath = path.resolve(srcPath, `views/${moduleName}/views/${className}.vue`);
        fs.writeFileSync(wpath, tml);
    })
    .then(() => {
        var tml = fs.readFileSync(path.resolve(tempPath, "vue_ts"), "utf-8");
        tml = tml.replace(/\$\{className\}/g, className);

        const wpath = path.resolve(srcPath, `views/${moduleName}/views/${className}.ts`);
        fs.writeFileSync(wpath, tml);
    })
    .then(() => {
        var tml = fs.readFileSync(path.resolve(tempPath, "vue_html"), "utf-8");
        tml = tml.replace(/\$\{moduleName\}/g, moduleName);

        const wpath = path.resolve(srcPath, `views/${moduleName}/views/${className}.vue.html`);
        fs.writeFileSync(wpath, tml);
    })
    .then(() => {
        let wpath = path.resolve(srcPath, `views/${moduleName}/views/${className}.vue.scss`);
        fs.writeFileSync(wpath, "");
    })
    .then(() => {
        console.log("done!");
    });
