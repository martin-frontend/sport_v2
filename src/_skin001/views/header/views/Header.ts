import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import HeaderMediator from "../mediator/HeaderMediator";
import HeaderProxy from "../proxy/HeaderProxy";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import GlobalVar from "@/core/global/GlobalVar";
import OpenLink from "@/core/global/OpenLink";
@Component
export default class Header extends AbstractView {
    LangUtil = LangUtil;
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: HeaderProxy = this.getProxy(HeaderProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(HeaderMediator);
    }

    onMarketTypeArea(value: any) {
        this.settingProxy.pageData.form.MarketType_area = value;
        this.settingProxy.api_user_set_user_setting();
    }

    onSettingSave(value: any) {
        if (!value) {
            this.settingProxy.api_user_set_user_setting();
        }
    }
    openCompetionResult() {
        const link = `./skin001_competion_result.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}`;
        try {
            window.open(
                link,
                LangUtil("客服"),
                "height=638, width=972, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
            );
        } catch (e: any) {
            OpenLink(link);
        }
    }
    destroyed() {
        super.destroyed();
    }
}
