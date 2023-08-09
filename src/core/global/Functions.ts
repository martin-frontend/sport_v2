// 全局属性和方法

import AbstractView from "../abstract/AbstractView";
import GlobalVar from "./GlobalVar";
import { EnumPostMessage } from "@/enum/EnumPostMessage";
import LangUtil from "./LangUtil";
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

// /**按时区获取时间, 默认GMT0 */
// export function getDateByTimeZone(time: number, timezone: any = 0) {
//     const offset_gmt = new Date().getTimezoneOffset();
//     const d = new Date(time + offset_gmt * 60 * 1000 + timezone * 60 * 60 * 1000);
//     return d;
// }

/**时区转换 分钟转小时
 * input: 9 或9:30 output 9 或9.5
 */
function formatTimeZone(zone: any) {
    if (isNaN(zone - 0)) {
        const zoneArr = zone.split(":");
        return zoneArr[0] - 0 + zoneArr[1] / 60 - 0;
    } else {
        return zone - 0;
    }
}
/**按时区获取时间, 默认GMT0 */
export function getDateByTimeZone(time: number, timezone: any = 0) {
    const offset_gmt = new Date().getTimezoneOffset();
    const d = new Date(time + offset_gmt * 60 * 1000 + formatTimeZone(timezone) * 60 * 60 * 1000);
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
export function amountFormat(val: any, decimal: boolean = false, decimalLang: number = 2, prefix: string = ""): string {
    let numericAmount = 0;

    if (val && typeof val === "string") {
        // 使用正则表达式提取数字部分（包括小数点）
        const numericString = val.replace(/[^0-9.]/g, "");
        numericAmount = parseFloat(numericString);
    } else {
        numericAmount = val;
    }

    const formattedAmount = numericAmount.toLocaleString(GlobalVar.lang.substring(0, 2), {
        minimumFractionDigits: decimal ? decimalLang : 0,
        maximumFractionDigits: decimalLang,
    });
    return prefix + formattedAmount;
}
//解析数字格式
export function parseLocaleNumber(stringNumber: any) {
    const format = new Intl.NumberFormat(GlobalVar.lang.substring(0, 2));

    const groupSeparator = format.format(1000).charAt(1);
    const decimalSeparator = format.format(0.1).charAt(1);

    const sanitizedNumber = stringNumber.replace(new RegExp(`\\${groupSeparator}`, "g"), "").replace(decimalSeparator, ".");

    return parseFloat(sanitizedNumber) || 0;
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
export function logEnterTips() {
    if (window.parent) {
        window.parent.postMessage({ action: "unlogin" }, "*");
    }
    AbstractView.notify({
        group: "message",
        title: LangUtil("您是游客用户,请先登录后再操作"),
    });
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
 * 获取今日零点时间
 * @offset 偏移天数
 * @offsetSecond 偏移秒
 */
export function getTodayOffset(offset = 0, offsetSecond = 0): any {
    const symbal = GlobalVar.zone.substring(0, 1);
    let timezone = "GMT" + symbal;
    const arr = GlobalVar.zone.substring(1).split(":");
    if (arr.length == 1) {
        if (arr[0].length == 1) {
            timezone += "0" + arr[0] + "00";
        } else {
            timezone += arr[0] + "00";
        }
    } else {
        if (arr[0].length == 1) {
            timezone += "0" + arr[0] + arr[1];
        } else {
            timezone += arr[0] + arr[1];
        }
    }
    const today = getDateByTimeZone(GlobalVar.server_time * 1000 + 86400000 * offset, GlobalVar.zone);
    const formatdate = dateFormat(today, "yyyy/MM/dd");
    const formatdate2 = dateFormat(today, "yyyy-MM-dd");
    const timestr = (Date.parse(dateFormat(today, "yyyy/MM/dd 00:00:00") + " " + timezone) / 1000 + offsetSecond).toString();
    return { timestr, formatdate, formatdate2 };
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
/**
 * 获取URL中的参数
 * @param updateParam
 * @param deleteParam
 */
export function formatURLParam(updateParam?: any, deleteParam?: string[]) {
    const request = getURLParam();
    if (updateParam) {
        const keys = Object.keys(updateParam);
        for (const key of keys) {
            request[key] = updateParam[key];
        }
    }
    if (deleteParam) {
        for (const key of deleteParam) {
            delete request[key];
        }
    }
    const arr: string[] = [];
    for (const key of Object.keys(request)) {
        arr.push(`${key}=${request[key]}`);
    }
    return arr.join("&");
}
/**
 * 获取URL中的参数
 */
export function getURLParam() {
    const url = location.search; //获取url中"?"符后的字串
    let theRequest: any = new Object();
    if (url.indexOf("?") != -1) {
        let str = url.substring(1);
        const strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
/**获取URL中hash参数 */
export function getUrlHashParam(key: string): string {
    const arr = location.hash.split("?");
    if (arr[1]) {
        const arr1 = arr[1].split("&");
        for (const item of arr1) {
            const arr2 = item.split("=");
            if (arr2[0] == key) {
                return arr2[1];
            }
        }
    }

    return "";
}
/**计算全场总时间 */
export function getFullTime(match_phase: any, phase_minute: any) {
    if (!match_phase) return phase_minute;
    let times = 0;
    if (typeof phase_minute == "string") {
        times = parseInt(phase_minute);
    } else if (typeof phase_minute == "number") {
        times = phase_minute;
    }

    if (match_phase == "2H") {
        times = times + 45;
    } else if (match_phase == "1H OT" || match_phase == "OT HT") {
        times = times + 90;
    } else if (match_phase == "2H OT") {
        times = times + 105;
    }

    return times;
}
