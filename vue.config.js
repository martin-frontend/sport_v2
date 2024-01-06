const { js_utils } = require("custer-js-utils");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
function resolve(dir) {
    return path.join(__dirname, "./", dir);
}

module.exports = {
    publicPath: process.env.NODE_ENV === "production" ? "././" : "./",
    outputDir: "dist",
    productionSourceMap: false,
    lintOnSave: false,
    transpileDependencies: ["vuetify"],
    chainWebpack: (config) => {
        config.plugin("define").tap((args) => {
            args[0]["process.env"].version = `"${js_utils.dateFormat(new Date(), "yyyy-MM-dd hh:mm")}"`;
            return args;
        });
        // svg rule loader
        const svgRule = config.module.rule("svg"); // 找到svg-loader
        svgRule.uses.clear(); // 清除已有的loader, 如果不这样做会添加在此loader之后
        svgRule.exclude.add(/node_modules/); // 正则匹配排除node_modules目录
        svgRule // 添加svg新的loader处理
            .test(/\.svg$/)
            .use("svg-sprite-loader")
            .loader("svg-sprite-loader")
            .options({
                symbolId: "icon-[name]",
            });

        // 修改images loader 添加svg处理
        const imagesRule = config.module.rule("images");
        imagesRule.exclude.add(resolve("src/_skin001/icons"));
        config.module.rule("images").test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);
    },

    devServer: {
        port: 3001, // 端口
    },

    // liveplayer
    configureWebpack: {
        plugins: [
            new CopyWebpackPlugin([
                { from: "node_modules/@liveqing/liveplayer/dist/component/crossdomain.xml" },
                { from: "node_modules/@liveqing/liveplayer/dist/component/liveplayer-lib.min.js", to: "js/" },
                { from: "node_modules/@liveqing/liveplayer/dist/component/liveplayer.swf" },
            ]),
        ],
    },

    css: {
        extract: {
            ignoreOrder: true,
        },
    },
    pages: {
        skin001: {
            entry: "src/_skin001/main.ts",
            template: "public/index001.html",
            filename: "skin001.html",
            title: "sport",
        },
        skin001_1: {
            entry: "src/_skin001_1/main.ts",
            template: "public/index001_1.html",
            filename: "skin001_1.html",
            title: "sport",
        },
        skin001_competionResult: {
            entry: "src/_skin001_competion_result/main.ts",
            template: "public/index001_competion_result.html",
            filename: "skin001_competion_result.html",
            title: "result",
        },
        skin001_historyResult: {
            entry: "src/_skin001_history_result/main.ts",
            template: "public/index001_history_result.html",
            filename: "skin001_history_result.html",
            title: "history",
        },
        skin001_orderResult: {
            entry: "src/_skin001_order_result/main.ts",
            template: "public/index001_order_result.html",
            filename: "skin001_order_result.html",
            title: "Order Detail",
        },
        skin001_help: {
            entry: "src/_skin001_help/main.ts",
            template: "public/index001_help.html",
            filename: "skin001_help.html",
            title: "help",
        },
        skin001_order_detail: {
            entry: "src/_skin001_order_result/main.ts",
            template: "public/index001_order_detail.html",
            filename: "index001_order_detail.html",
            title: "detail",
        },
        // skin001_order_detail: {
        //     entry: "src/_skin001_order_detail/main.ts",
        //     template: "public/index001_order_detail.html",
        //     filename: "index001_order_detail.html",
        //     title: "detail",
        // },
    },
};
