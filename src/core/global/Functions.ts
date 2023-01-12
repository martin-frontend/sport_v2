// 全局属性和方法

import GlobalVar from "./GlobalVar";

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
export function getDateByTimeZone(time: number, timezone: any = 0) {
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
 * 获取URL参数
 * @param value
 */
export function getQueryVariable(value: string): string | null {
    let after = window.location.search;

    //value存在先通过search取值如果取不到就通过hash来取

    after = after.substring(1) || window.location.hash.split("?")[1];

    if (after) {
        const reg = new RegExp("(^|&)" + value + "=([^&]*)(&|$)");
        const r = after.match(reg);
        if (r != null) {
            return decodeURIComponent(r[2]);
        } else {
            return null;
        }
    }
    return null;
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

/**
 * 金额格式化
 * input 1000 output 1,000
 * val 进入的数字
 * decimal 是否要小数点
 * decimalLang 小数点几位
 */
export function amountFormat(val: any, decimal: boolean = false, decimalLang: number = 2) {
    const intValue = parseFloat(val);
    const str = intValue.toFixed(decimalLang) + "";
    const sum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ","); //取到整数部分
    const dot = str.substring(str.length, str.indexOf(".")); //取到小数部分搜索

    return decimal ? sum + dot : sum;
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
    return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
    if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
    if (hasClass(ele, cls)) {
        const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
        ele.className = ele.className.replace(reg, " ");
    }
}

/**
 * 如果是香港盘赔率要减一
 * input 1 output input -1
 * price 欧洲盘的赔率
 */
export function TransMarketPrice(price: any) {
    if (GlobalVar.MarketType_area == "1") {
        return Math.round((price - 1) * 100) / 100;
    } else {
        return price;
    }
}
/**
 * 格式化賽事時間
 * @param time 年-月-日 時:分:秒
 * @returns 月-日 時:分
 */
export function formatEventTime(time: string) {
    return time ? time.substring(5, 16) : time;
}
/**
 * 获取球队图标
 * @param url
 * @return host + url
 */
export function getResponseIcon(url: string) {
    if (url && (url.indexOf("png") !== -1 || url.indexOf("jpg") !== -1)) {
        return url;
    }
    // 預設圖片
    return require(`@/_skin001/assets/team.png`);
}
