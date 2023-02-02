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
    myProxy: DialogSettingProxy = this.getProxy(DialogSettingProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(DialogSettingMediator);
    }

    openCompetionResult() {
        const link = `./skin001_competion_result.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}`;
        OpenLink(link);
    }

    onReSetting() {
        const settingProxy: SettingProxy = getProxy(SettingProxy);
        settingProxy.api_user_set_user_setting(true);
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
}
