import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import DialogSettingMediator from "../mediator/DialogSettingMediator";
import DialogSettingProxy from "../proxy/DialogSettingProxy";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import OpenLink from "@/core/global/OpenLink";
import GlobalVar from "@/core/global/GlobalVar";
import getProxy from "@/core/global/getProxy";
import BlurUtil from "@/core/global/BlurUtil";

@Component
export default class DialogSetting extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    myProxy: SettingProxy = this.getProxy(SettingProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(DialogSettingMediator);
    }

    openCompetionResult() {
        const dark = this.$vuetify.theme.dark;
        const link = `./skin001_competion_result.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}&dark=${dark}`;
        OpenLink(link);
    }

    onClose() {
        this.pageData.bShow = false;
        const settingProxy: SettingProxy = getProxy(SettingProxy);
        settingProxy.api_user_set_user_setting();
    }

    @Watch("pageData.bShow")
    onWatchShow(){
        BlurUtil(this.pageData.bShow);
    }

    get getSelectName() {
        const data = this.pageData.items.find((item: any) => item.key == this.pageData.form.timezone);
        if (data) {
            return data.value + LangUtil(data.name);
        }
        return "";
    }

    onMarketTypeArea(type:string){
        this.pageData.form.MarketType_area = type;
        GlobalVar.MarketType_area = type;
    }

    onTimeZoneItemClick(value:string){
        this.pageData.form.timezone = value;
        GlobalVar.zone = value;
    }

    onReSetting() {
        this.myProxy.api_user_set_user_setting(true);
    }
}
