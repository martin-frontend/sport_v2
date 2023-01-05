var path = require("path");
var fs = require("fs");
var utils = require("./utils");

(function () {
    return new Promise((resolve, reject) => {
        // 创建文件夹
        utils.mkdirsSync(path.join(__dirname, `../src/net`));
        // 读取配置
        var confStr = fs.readFileSync(path.join(__dirname, "proto/config.json"), "utf-8");
        var conf = JSON.parse(confStr);

        resolve(conf);
    });
})()
    .then((conf) => {
        for (let p of conf.list) {
            if (typeof p != "string") {
                var pName = utils.getPName(p[0]);
                var description = p[1];

                var outputFile = path.join(__dirname, `../src/net/cmd_${pName}.ts`);
                var data = fs.readFileSync(path.join(__dirname, "proto", "cmd_template"), "utf-8");

                var str = data.replace(/\$\{pName\}/g, pName);
                str = str.replace("${description}", description);
                fs.writeFileSync(outputFile, str);
                console.log(pName + ".ts 写入成功！");
            }
        }
        return conf;
    })
    .then((conf) => {
        // console.log(conf);
        var outputFile = path.join(__dirname, `../src/net/setting.ts`);

        var plist = conf.list;

        var infoStr = `/**\n * document: ${conf.document}\n */\n`;

        var importStr = "";
        var httpTypeStr = `/**协议*/\nconst HttpType = {\n`;
        var eventTypeStr = `/**事件*/\nconst EventType = {
    /**--请求开始*/
    REQUEST_START: "REQUEST_START",
    /**--请求结束 */
    REQUEST_END: "REQUEST_END",
    /**请求错误 */
    REQUEST_ERROR: "REQUEST_ERROR",
    /**IO错误 */
    IO_ERROR: "IO_ERROR",
`;
        var regStr = `/**注册协议*/\nfunction initCommand() {\n    const facade = puremvc.Facade.getInstance();\n`;
        var typeName = "";
        for (let p of plist) {
            if (p.indexOf("--") != -1) {
                typeName = p + "--";
                httpTypeStr += "\n";
                eventTypeStr += "\n";
                regStr += "    //" + p + "\n";
                continue;
            }
            if (typeof p != "string") {
                var pName = utils.getPName(p[0]);
                var pInfo = `    /**${typeName}${p[1]}*/`;
                importStr += `import cmd_${pName} from "./cmd_${pName}";\n`;
                httpTypeStr += `${pInfo}\n    ${pName}: "${p[0]}",\n`;
                eventTypeStr += `${pInfo}\n    ${pName}: "${pName}",\n`;
                regStr += `    facade.registerCommand(HttpType.${pName}, cmd_${pName});\n`;
            }
        }

        httpTypeStr += "};\n";
        eventTypeStr += "};\n";

        var str = importStr + infoStr + httpTypeStr + eventTypeStr + regStr + "}";

        str += "\n";
        str += "const net = { HttpType, EventType, initCommand };\n";
        str += "export default net;\n";

        fs.writeFile(outputFile, str, function (err) {
            if (err) {
                return console.error(err);
            }
            console.log("setting.ts 写入成功！");
        });
    });
