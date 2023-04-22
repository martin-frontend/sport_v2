import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import SettingMediator from "../mediator/SettingMediator";
import SettingProxy from "@/proxy/SettingProxy";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";

@Component
export default class Setting extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    myProxy: SettingProxy = this.getProxy(SettingProxy);
    pageData = this.myProxy.pageData;

    radioGroup = 0;

    constructor() {
        super(SettingMediator);
    }

    get getSelectName() {
        const data = this.pageData.items.find((item: any) => item.key == this.pageData.form.timezone);
        if (data) {
            return data.value + LangUtil(data.name);
        }
        return "";
    }

    onMarketTypeArea(type: string) {
        this.pageData.form.MarketType_area = type;
        GlobalVar.MarketType_area = type;
    }

    onTimeZoneItemClick(value: string) {
        this.pageData.form.timezone = value;
        GlobalVar.zone = value;
    }

    onReSetting() {
        this.myProxy.api_user_set_user_setting(true);
    }

    destroyed() {
        super.destroyed();
    }
}
