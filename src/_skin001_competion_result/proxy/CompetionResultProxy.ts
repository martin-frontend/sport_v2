import net from "@/net/setting";
import GlobalVar from "@/core/global/GlobalVar";
import { dateFormat, getDateByTimeZone } from "@/core/global/Functions";
import { getQueryVariable } from "@/core/global/Functions";
import PlatConfig from "@/core/config/PlatConfig";
export default class CompetionResultProxy extends puremvc.Proxy {
    static NAME = "CompetionResultProxy";
    public onRegister(): void {
        this.pageData.loading = false;
        // TODO 请求初始数据
    }
    panel = <any>[];
    selectDate:any;
    init() {
        this.sendNotification(net.HttpType.api_event_sports);
        this.sendNotification(net.HttpType.api_event_market_type_v2);
        this.api_event_result();
    }

    pageData = {
        loading: false,
        competition_list: [],
        length: 0,
    };

    api_event_result() {
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
        

        const data = {
            start_time: Date.parse(this.selectDate + " " + timezone) / 1000,
            end_time: (Date.parse(this.selectDate + " " + timezone)+86400000) / 1000 - 1,
            timezone: GlobalVar.zone,
            page_size: 1000,

        };

        this.sendNotification(net.HttpType.api_event_result, data);
    }
    set_envent_result(data: any) {
        this.pageData.competition_list = [];
        this.pageData.length = 0;
        GlobalVar.loading = false;
        this.pageData.competition_list = data;
        this.pageData.length = data.length;

        this.panel = this.pageData.competition_list.map((k: any, i: number) => i);
    }
    set_public_plat_config(data: any){
            // PlatConfig.config = data.data;
            // GlobalVar.plat_id = this.form.plat_id?.toString() || "";
            // GlobalVar.zone = this.form.timezone?.toString() || "";
            // GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
            // GlobalVar.lang = this.form.lang;
    }
}