// 全局属性和方法
/** 获取UUID */
export function generateUUID() {
    let d = new Date().getTime();
    const uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}

/** 格式化日期 */
export function dateFormat(d: any, fmt: any): string {
    const o: any = {
        "M+": d.getMonth() + 1, //月份
        "d+": d.getDate(), //日
        "h+": d.getHours(), //小时
        "m+": d.getMinutes(), //分
        "s+": d.getSeconds(), //秒
        "q+": Math.floor((d.getMonth() + 3) / 3), //季度
        S: d.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (const k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    return fmt;
}

/**按时区获取时间, 默认GMT0 */
export function getDateByTimeZone(time: number, timezone: number = 0) {
    const offset_gmt = new Date().getTimezoneOffset();
    const d = new Date(time + offset_gmt * 60 * 1000 + timezone * 60 * 60 * 1000);
    return d;
}

/** 获取临时文件版本号 */
export function getFileVersion(): string {
    const min = (new Date().getTime() / 1000 / 60) >> 0;
    return ((min / 60) >> 0).toString() + (((min % 60) / 15) >> 0).toString();
}

/** 去掉空属性/空符串，并返回一个新对象 */
export function objectRemoveNull(obj: any, except: any[] = [undefined, null, ""]): any {
    const result: any = {};
    for (const c of Object.keys(obj)) {
        if (!except.includes(obj[c])) {
            result[c] = obj[c];
        }
    }
    return result;
}

/**
 * 表单跟原数据对比，提取变化的数据
 * @param obj 表单数据
 * @param source 源数据
 */
export function formCompared(obj: any, source: any, except: string[] = []): any {
    const result: any = {};

    for (const c of Object.keys(obj)) {
        if (obj[c] && typeof obj[c] == "object") {
            if (except.includes(c) || JSON.stringify(obj[c]) != JSON.stringify(source[c])) {
                result[c] = JSON.stringify(obj[c]);
            }
        } else if (except.includes(c) || obj[c] != source[c]) {
            result[c] = obj[c];
        }
    }
    return objectRemoveNull(result, [undefined, null]);
}

/**是否android */
export function isAndroid() {
    const flag = navigator.userAgent.match(/(Android)/i);
    return flag;
}

/**是否IOS */
export function isIOS() {
    const flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad)/i);
    return flag;
}
