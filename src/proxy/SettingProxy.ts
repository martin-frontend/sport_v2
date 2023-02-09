import PlatConfig from "@/core/config/PlatConfig";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import LangUtil from "@/core/global/LangUtil";
import net from "@/net/setting";
import SelfProxy from "@/proxy/SelfProxy";
import { RemarkVO } from "@/vo/RemarkVO";

export default class SettingProxy extends puremvc.Proxy {
    static NAME = "SettingProxy";

    pageData = {
        bShow: false,
        isReset: true,
        //如果是列表，使用以下数据，否则删除
        form: <RemarkVO>{
            currency_type: GlobalVar.currency,
            fast_choose: ["10", "20", "30", "40", "50", "60"],
            timezone: GlobalVar.zone,
            sort: "comp", //time->时间 comp->联赛
            MarketType_area: GlobalVar.MarketType_area, //0->欧洲盘  1->香港盘
        },
        //时区
        items: [
            {
                key: "-9",
                value: `GMT-9`,
                name: `${LangUtil("美國 (阿拉斯加）")}`,
            },
            {
                key: "-8",
                value: "GMT-8",
                name: `${LangUtil("北美 (太平洋）")}`,
            },
            {
                key: "-7",
                value: "GMT-7 ",
                name: LangUtil("北美 (山地）"),
            },
            {
                key: "-6",
                value: "GMT-6 ",
                name: LangUtil("北美 (中部）"),
            },
            {
                key: "-5",
                value: "GMT-5 ",
                name: LangUtil("北美 (東部) /古巴/ 哥倫比亞"),
            },
            {
                key: "-4",
                value: "GMT-4 ",
                name: LangUtil("加拿大 (大西洋) / 波多黎各"),
            },

            {
                key: "-3",
                value: "GMT-3 ",
                name: LangUtil("格陵蘭 / 阿根廷 / 烏拉圭 / 智利"),
            },
            {
                key: "-2",
                value: "GMT-2 ",
                name: LangUtil("南喬治亞群島"),
            },

            {
                key: "-1",
                value: "GMT-1 ",
                name: LangUtil("佛得角"),
            },
            {
                key: "+0",
                value: "GMT+0 ",
                name: LangUtil("英國 / 葡萄牙"),
            },
            {
                key: "+1",
                value: "GMT+1 ",
                name: LangUtil("西班牙 / 德國 / 法國 / 意大利"),
            },
            {
                key: "+2",
                value: "GMT+2 ",
                name: LangUtil("俄羅斯/南非"),
            },
            {
                key: "+3",
                value: "GMT+3 ",
                name: LangUtil("俄羅斯/沙特阿拉伯"),
            },
            {
                key: "+3:30",
                value: "GMT+3:30 ",
                name: LangUtil("伊朗"),
            },
            {
                key: "+4",
                value: "GMT+4 ",
                name: LangUtil("阿塞拜疆/阿聯酋"),
            },
            {
                key: "+4:30",
                value: "GMT+4:30 ",
                name: LangUtil("阿富汗"),
            },
            {
                key: "+5",
                value: "GMT+5 ",
                name: LangUtil("哈薩克斯坦 / 巴基斯坦"),
            },
            {
                key: "+5:30",
                value: "GMT+5:30 ",
                name: LangUtil("斯里蘭卡 / 印度"),
            },
            {
                key: "+5:45",
                value: "GMT+5:45 ",
                name: LangUtil("尼泊爾"),
            },
            {
                key: "+6",
                value: "GMT+6 ",
                name: LangUtil("不丹"),
            },
            {
                key: "+6:30",
                value: "GMT+6:30 ",
                name: LangUtil("緬甸"),
            },
            {
                key: "+7",
                value: "GMT+7 ",
                name: LangUtil("柬埔寨/印度尼西亞/越南"),
            },
            {
                key: "+8",
                value: "GMT+8 ",
                name: LangUtil("中國/香港/西澳洲"),
            },

            {
                key: "+9",
                value: "GMT+9 ",
                name: LangUtil("韓國/日本"),
            },
            {
                key: "+10",
                value: "GMT+10 ",
                name: LangUtil("關島"),
            },
            {
                key: "+10:30",
                value: "GMT+10:30 ",
                name: LangUtil("中澳洲"),
            },
            {
                key: "+11",
                value: "GMT+11 ",
                name: LangUtil("東澳洲"),
            },
            {
                key: "+12",
                value: "GMT+12 ",
                name: LangUtil("斐濟"),
            },

            {
                key: "+13",
                value: "GMT+13 ",
                name: LangUtil("新西蘭/薩摩亞/湯加"),
            },
            {
                key: "+14",
                value: "GMT+14 ",
                name: LangUtil("基里巴斯"),
            },
        ],
    };

    resetForm() {
        if (this.pageData.isReset) {
            this.pageData.isReset = false;
            const selfProxy: SelfProxy = getProxy(SelfProxy);
            const { remark } = selfProxy.userInfo.user_setting;
            const { form } = this.pageData;
            let json: any = {};
            if (remark) {
                json = JSON.parse(selfProxy.userInfo.user_setting.remark) ?? {};
            }

            form.fast_choose = json.fast_choose ?? selfProxy.userInfo.fast_choose.split(",");
            form.sort = json.sort ?? "comp";
            form.MarketType_area = json.MarketType_area ?? PlatConfig.config.client.MarketType_area;
            form.currency_type = json.currency_type ?? selfProxy.userInfo.currency_type;
            form.timezone = json.timezone;
            if (!json.timezone) {
                const offset = -(new Date().getTimezoneOffset() / 60);
                form.timezone = offset >= 0 ? `+${offset}` : `${offset}`;
            }

            GlobalVar.MarketType_area = form.MarketType_area;
            GlobalVar.currency = form.currency_type; //币别
            GlobalVar.zone = form.timezone;
        }
    }

    api_user_set_user_setting(isReset: boolean = false) {
        this.pageData.isReset = isReset;
        if (isReset) {
            this.sendNotification(net.HttpType.api_user_set_user_setting, { remark: "" });
        } else {
            const selfProxy: SelfProxy = getProxy(SelfProxy);
            const remark = JSON.stringify(this.pageData.form);
            if (remark != selfProxy.userInfo.user_setting.remark) {
                this.sendNotification(net.HttpType.api_user_set_user_setting, { remark });
            }
        }
    }
}
