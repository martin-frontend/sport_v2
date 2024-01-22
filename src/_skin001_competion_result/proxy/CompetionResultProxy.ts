import net from "@/net/setting";
import GlobalVar from "@/core/global/GlobalVar";
import { dateFormat, getDateByTimeZone, getTodayOffset } from "@/core/global/Functions";
import { getQueryVariable } from "@/core/global/Functions";
import PlatConfig from "@/core/config/PlatConfig";
import LangConfig from "@/core/config/LangConfig";
import Assets from "@/_skin001/assets/Assets";
import LangUtil from "@/core/global/LangUtil";
import SportUtil from "@/core/global/SportUtil";
export default class CompetionResultProxy extends puremvc.Proxy {
    static NAME = "CompetionResultProxy";
    public onRegister(): void {
        this.pageData.loading = false;
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

    nowtime = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10);
    panel = <any>[];
    selectDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10);

    init() {
        if (!this.listQuery.sport_id) return;
        this.api_event_market_type_v2();
        this.api_event_result_v2();
    }

    pageData = {
        loading: false,
        competition_list: [],
        length: 0,
        sportOptions: <any>[],
    };

    listQuery: any = {
        sport_id: 0,
        start_time: "",
        end_time: "",
        timezone: GlobalVar.zone,
        unique: CompetionResultProxy.name,
    };

    api_event_result_v2() {
        this.pageData.competition_list = [];
        GlobalVar.loading = true;
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

        const tempdate = this.selectDate.replace(/-/g, "/");
        this.listQuery.start_time = Date.parse(tempdate + " " + timezone) / 1000;
        this.listQuery.end_time = (Date.parse(tempdate + " " + timezone) + 86400000) / 1000 - 1;

        this.sendNotification(net.HttpType.api_event_result_v2, { ...this.listQuery, unique: "CompetionResultProxy" });
    }
    set_envent_result_v2(data: any) {
        this.isloadSecLang = true;
        this.pageData.competition_list = [];
        this.pageData.length = 0;
        GlobalVar.loading = false;
        delete data.requestData;
        this.pageData.competition_list = data;
        this.pageData.length = data.length;

        this.panel = this.pageData.competition_list.map((k: any, i: number) => i);
    }
    api_public_plat_config() {
        const { lang, plat_id, timezone, token } = this.form;
        this.sendNotification(net.HttpType.public_plat_config, {
            lang,
            plat_id,
            timezone,
            token,
        });
    }
    api_event_sports() {
        this.sendNotification(net.HttpType.api_event_sports);
    }
    api_event_market_type_v2() {
        if (SportUtil.isRaceEvent(this.listQuery.sport_id)) return;
        this.sendNotification(net.HttpType.api_event_market_type_v2, { ...this.listQuery, unique: "CompetionResultProxy" });
    }
    set_public_plat_config(data: any) {
        PlatConfig.config = data;
        const { lang, plat_id, timezone, token } = this.form;
        GlobalVar.plat_id = plat_id?.toString() || "";
        GlobalVar.zone = timezone?.toString() || "";
        GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
        GlobalVar.lang = lang;
        GlobalVar.token = token;
        const sTime = GlobalVar.server_time;
        this.selectDate = dateFormat(getDateByTimeZone(sTime * 1000, GlobalVar.zone), "yyyy-MM-dd");
        LangConfig.load(this.form.lang, true).then(() => {
            this.isloadSecLang = true;
            this.sendNotification(net.HttpType.api_event_sports);
        });
    }
    setSportTagData(body: any) {
        // if (!body || body.length < 1) return;

        this.pageData.sportOptions.length = 0;

        for (let index = 0; index < body.length; index++) {
            const element = body[index];
            if (element.status != 1) continue;
            const obj = JSON.parse(JSON.stringify(element));
            obj.icon = Assets.SportIcon[element.id];
            obj.name = LangUtil(element.name);
            this.pageData.sportOptions.push(obj);
        }
        this.listQuery.sport_id = this.pageData.sportOptions[0]?.id;
        this.init();
    }
}
