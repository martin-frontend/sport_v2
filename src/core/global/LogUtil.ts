export default class LogUtil {
    static init() {
        // @ts-ignore
        const compiletype = process.env.VUE_APP_ENV;
        if (compiletype === "production") {
            if (window.console) {
                const methods = ["log", "debug", "warn", "info", "group", "groupCollapsed"];
                for (let i = 0; i < methods.length; i++) {
                    const c: any = console;
                    c[methods[i]] = function () {};
                }
            }
        }
    }
}
