import net from "@/net/setting";
import GlobalVar from "@/core/global/GlobalVar";
import { objectRemoveNull, dateFormat, getDateByTimeZone } from "@/core/global/Functions";
import { getQueryVariable, getTodayOffset } from "@/core/global/Functions";
import LangConfig from "@/core/config/LangConfig";
import PlatConfig from "@/core/config/PlatConfig";

import { DatePicker } from "element-ui";
import Vue from "vue";
import localeE from "element-ui/lib/locale";
import lang_en from "element-ui/lib/locale/lang/en";
import lang_ja from "element-ui/lib/locale/lang/ja";
import lang_ko from "element-ui/lib/locale/lang/ko";
import lang_es from "element-ui/lib/locale/lang/es";
import lang_vi from "element-ui/lib/locale/lang/vi";
import lang_zh from "element-ui/lib/locale/lang/zh-CN";
import lang_zhtw from "element-ui/lib/locale/lang/zh-TW";
import LangUtil from "@/core/global/LangUtil";

export default class HistoryResultProxy extends puremvc.Proxy {
    static NAME = "HistoryResultProxy";
    public onRegister(): void {
        // TODO 请求初始数据
    }
    form = {
        lang: getQueryVariable("lang") || "zh_CN",
        order_id: getQueryVariable("order_id"),
        plat_id: getQueryVariable("plat_id"),
        timezone: getQueryVariable("timezone"),
        sign: getQueryVariable("sign"),
        token: getQueryVariable("t") || "",
    };
    isloadSecLang = false;
    nowtime: any;
    selectDate = ["", ""];
    pageData = {
        list: <any>[],
        nodata: true,
        states: <any>[], //滚球 数据是state
        pageInfo: {
            pageCurrent: 1,
            pageCount: 1,
            pageSize: 20,
            pageTotal: 1,
        },
        stats: {
            total_stake: "0.000", // 总投注
            total_win: "0.000", // 总输赢
            total_expected_win: "0.000", // 总预计输赢
            total_count: 1, // 总注单数
        },
        // 列表是否加载完成，手机模式专用
        finished: false,
        done: <any>null,
        isActive: 0,
    };
    listQuery: any = {
        is_settle: 1, //1=已结算 0=未结算
        page_count: 1,
        page_size: 10,
        pageInfo: { pageCurrent: 0 },
        // "settle_time-{>=}": "",
        // "settle_time-{<=}": "",
        "create_time-{>=}": "",
        "create_time-{<=}": "",
    };
    init() {
        this.sendNotification(net.HttpType.api_event_sports);
        this.sendNotification(net.HttpType.api_event_market_type_v2);
    }
    get_order_by_limit(type: number) {
        this.listQuery.page_count = 1;

        this.pageData.list = [];
        // this.api_user_orders();
        this.api_user_orders_v3();
    }
    get_order_selectdata(selectDate: any) {
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
        this.listQuery.page_count = 1;
        this.listQuery["create_time-{>=}"] = Date.parse(selectDate[0] + " " + timezone) / 1000;
        this.listQuery["create_time-{<=}"] = Date.parse(selectDate[1] + " " + timezone) / 1000 - 1;
        this.pageData.list = [];
        // this.api_user_orders();
        this.api_user_orders_v3();
    }

    set_user_orders(data: any) {
        GlobalVar.loading = false;
        Object.assign(this.pageData.stats, data.stats);
        Object.assign(this.pageData.pageInfo, data.pageInfo);
        this.pageData.list.push(...data.list);
        if (this.pageData.list.length == 0) {
            this.pageData.nodata = true;
        } else {
            this.pageData.nodata = false;
        }
    }
    /**手机下拉刷新 */
    listRefrush(done: any) {
        this.pageData.done = done;
        this.listQuery.page_count = 1;
        // this.api_user_orders();
        this.api_user_orders_v3();
    }
    /**手机上拉加载更多 */
    listMore(done: any) {
        this.pageData.done = done;
        this.listQuery.page_count++;
        // this.api_user_orders();
        this.api_user_orders_v3();
    }
    api_user_orders() {
        this.sendNotification(net.HttpType.api_user_orders, objectRemoveNull(this.listQuery));
    }
    api_user_orders_v3() {
        this.sendNotification(net.HttpType.api_user_orders_v3, objectRemoveNull(this.listQuery));
    }

    set_public_plat_config(data: any) {
        PlatConfig.config = data;
        const { lang, plat_id, timezone, token } = this.form;
        GlobalVar.plat_id = plat_id?.toString() || "";
        GlobalVar.zone = timezone?.toString() || "";
        GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
        GlobalVar.lang = lang;
        const sTime = GlobalVar.server_time;
        this.nowtime = dateFormat(getDateByTimeZone(sTime * 1000, GlobalVar.zone), "yyyy/MM/dd");
        console.log("this.nowtime>>>", this.nowtime);
        const start = getTodayOffset().formatdate3;
        const end = getTodayOffset(1, -1).formatdate3;
        this.selectDate = [start, end];
        // this.selectDate = [date1.toString(), date2.toString()];
        LangConfig.load(this.form.lang, true).then(() => {
            this.isloadSecLang = true;
            GlobalVar.token = token;
            this.setDateLang();
            // this.get_order_by_limit(0);
            this.setDateOption();
            this.get_order_selectdata(this.selectDate);
        });
    }
    setDateLang() {
        // 添加element ui 控件 语言
        if (GlobalVar.lang == "zh_CN") {
            localeE.use(lang_zh);
        } else if (GlobalVar.lang == "zh_TW") {
            localeE.use(lang_zhtw);
        } else {
            const langT = GlobalVar.lang.substring(0, 2);
            switch (langT) {
                case "es":
                    localeE.use(lang_es);
                    break;
                case "ko":
                    localeE.use(lang_ko);
                    break;
                case "jp":
                    localeE.use(lang_ja);
                    break;
                case "vi":
                    localeE.use(lang_vi);
                    break;
                default:
                    localeE.use(lang_en);
                    break;
            }
        }
        Vue.use(DatePicker);
    }

    setDateOption() {
        this.pickerOptions.shortcuts = [
            {
                text: LangUtil("今日"),
                onClick(picker: any) {
                    const start = getTodayOffset().formatdate3;
                    const end = getTodayOffset(1, -1).formatdate3;
                    picker.$emit("pick", [start, end]);
                },
            },
            {
                text: LangUtil("昨天"),
                onClick(picker: any) {
                    const start = getTodayOffset(-1).formatdate3;
                    const end = getTodayOffset(0, -1).formatdate3;
                    picker.$emit("pick", [start, end]);
                },
            },
            {
                text: LangUtil("7天"),
                onClick(picker: any) {
                    const start = getTodayOffset(-6).formatdate3;
                    const end = getTodayOffset(1, -1).formatdate3;
                    picker.$emit("pick", [start, end]);
                },
            },
            {
                text: LangUtil("30日"),
                onClick(picker: any) {
                    const start = getTodayOffset(-29).formatdate3;
                    const end = getTodayOffset(1, -1).formatdate3;
                    picker.$emit("pick", [start, end]);
                },
            },
        ];
    }
    pickerOptions = {
        shortcuts: <any>[],
    };

    api_public_plat_config() {
        const { lang, plat_id, timezone, token } = this.form;
        this.sendNotification(net.HttpType.public_plat_config, {
            lang,
            plat_id,
            timezone,
            token,
        });
    }
}
