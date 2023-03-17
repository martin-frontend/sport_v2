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
                key: "-8",
                value: `GMT-8`,
                name: `${LangUtil("GMT-8_desc")}`,
            },
            {
                key: "-7",
                value: "GMT-7",
                name: `${LangUtil("GMT-7_desc")}`,
            },
            {
                key: "-6",
                value: "GMT-6 ",
                name: LangUtil("GMT-6_desc"),
            },
            {
                key: "-5",
                value: "GMT-5 ",
                name: LangUtil("GMT-5_desc"),
            },
            {
                key: "-4",
                value: "GMT-4 ",
                name: LangUtil("GMT-4_desc"),
            },
            {
                key: "-3",
                value: "GMT-3 ",
                name: LangUtil("GMT-3_desc"),
            },

            {
                key: "-2",
                value: "GMT-2 ",
                name: LangUtil("GMT-2_desc"),
            },
            {
                key: "-1",
                value: "GMT-1 ",
                name: LangUtil("GMT-1_desc"),
            },

            {
                key: "+0",
                value: "GMT+0",
                name: LangUtil("GMT+0_desc"),
            },
            {
                key: "+1",
                value: "GMT+1 ",
                name: LangUtil("GMT+1_desc"),
            },
            {
                key: "+2",
                value: "GMT+2 ",
                name: LangUtil("GMT+2_desc"),
            },
            {
                key: "+3",
                value: "GMT+3 ",
                name: LangUtil("GMT+3_desc"),
            },
            {
                key: "+3:30",
                value: "GMT+3:30 ",
                name: LangUtil("GMT+3-30_desc"),
            },
            {
                key: "+4",
                value: "GMT+4 ",
                name: LangUtil("GMT+4_desc"),
            },
            {
                key: "+4:30",
                value: "GMT+4:30",
                name: LangUtil("GMT+4-30_desc"),
            },
            {
                key: "+5",
                value: "GMT+5 ",
                name: LangUtil("GMT+5_desc"),
            },
            {
                key: "+5:30",
                value: "GMT+5:30",
                name: LangUtil("GMT+5-30_desc"),
            },
            {
                key: "+5:45",
                value: "GMT+5:45",
                name: LangUtil("GMT+5-45_desc"),
            },
            {
                key: "+6",
                value: "GMT+6 ",
                name: LangUtil("GMT+6_desc"),
            },
            {
                key: "+6:30",
                value: "GMT+6:30 ",
                name: LangUtil("GMT+6-30_desc"),
            },
            {
                key: "+7",
                value: "GMT+7 ",
                name: LangUtil("GMT+7_desc"),
            },
            {
                key: "+8",
                value: "GMT+8 ",
                name: LangUtil("GMT+8_desc"),
            },

            {
                key: "+9",
                value: "GMT+9 ",
                name: LangUtil("GMT+9_desc"),
            },
            {
                key: "+10",
                value: "GMT+10 ",
                name: LangUtil("GMT+10_desc"),
            },
            {
                key: "+11",
                value: "GMT+11 ",
                name: LangUtil("GMT+11_desc"),
            },
            {
                key: "+12",
                value: "GMT+12 ",
                name: LangUtil("GMT+12_desc"),
            },

            {
                key: "+13",
                value: "GMT+13 ",
                name: LangUtil("GMT+13_desc"),
            },
            {
                key: "+14",
                value: "GMT+14 ",
                name: LangUtil("GMT+14_desc"),
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
