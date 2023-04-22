import GlobalVar from "@/core/global/GlobalVar";
import net from "@/net/setting";
import PlatConfig from "@/core/config/PlatConfig";
import { getQueryVariable } from "@/core/global/Functions";
import LangConfig from "@/core/config/LangConfig";
export default class HelpProxy extends puremvc.Proxy {
    static NAME = "HelpProxy";

    onRegister() {}
    form = {
        lang: getQueryVariable("lang") || GlobalVar.lang || "zh_CN",
        plat_id: getQueryVariable("plat_id") || GlobalVar.plat_id,
        timezone: getQueryVariable("timezone") || GlobalVar.zone,
        token: getQueryVariable("t") || GlobalVar.token || "",
    };
    panelIdxs = [<any>[], <any>[], <any>[], <any>[]];
    isloadSecLang = false;
    pageData = {
        tabIndex: 1,
        searchTxt: "",
        list: <any>[],
        pageInfo: { pageCurrent: 1, pageCount: 1, pageSize: 1, pageTotal: 1 },
        type: <any>[[], [], [], []],
    };
    set_public_plat_config(data: any) {
        PlatConfig.config = data;
        const { lang, plat_id, timezone, token } = this.form;
        GlobalVar.plat_id = plat_id?.toString() || "";
        GlobalVar.zone = timezone?.toString() || "";
        GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
        GlobalVar.lang = lang;
        LangConfig.load(this.form.lang, true).then(() => {
            this.api_helpcenter_list();
            GlobalVar.token = token;
        });
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
    api_helpcenter_list() {
        this.sendNotification(net.HttpType.api_helpcenter_list);
    }
    set_helpcenter_list(data: any) {
        Object.assign(this.pageData, data);
        let idx = 0;
        for (let i of this.pageData.list) {
            const typetemp = this.pageData.type.find((item: any) => item.id == i.type);
            typetemp.list = typetemp.list || [];
            typetemp.list.push(i);
        }
        for (let i of this.pageData.type) {
            const idxs = i.list.map((k: any, i: number) => i);
            this.panelIdxs[idx] = idxs;
            idx++;
        }
        console.group("set_helpcenter_list>>>> ", "color:#0f0;");
        console.log(JSON.parse(JSON.stringify(this.pageData)));
        console.groupEnd();
        setTimeout(() => {
            this.panelIdxs = [[], [], [], []];
        }, 1);
        setTimeout(() => {
            this.isloadSecLang = true;
        }, 500);
    }
    insetType1(data: any) {}
}
