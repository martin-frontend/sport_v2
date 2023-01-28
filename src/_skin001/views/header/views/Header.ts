import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import HeaderMediator from "../mediator/HeaderMediator";
import HeaderProxy from "../proxy/HeaderProxy";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import GlobalVar from "@/core/global/GlobalVar";
import OpenLink from "@/core/global/OpenLink";
import page_home from "../../page_home";
@Component
export default class Header extends AbstractView {
    LangUtil = LangUtil;
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: HeaderProxy = this.getProxy(HeaderProxy);
    pageData = this.myProxy.pageData;

    txtSearch = "";

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
        const dark = this.$vuetify.theme.dark;
        const link = `./skin001_competion_result.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}&dark=${dark}`;
        try {
            window.open(
                link,
                LangUtil("赛果"),
                "height=638, width=972, top=100, left=100, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no"
            );
        } catch (e: any) {
            OpenLink(link);
        }
    }
    openHistoryResult() {
        const dark = this.$vuetify.theme.dark;
        const link = `./skin001_history_result.html${window.location.search}&plat_id=${GlobalVar.plat_id}&MarketType_area=${GlobalVar.MarketType_area}&timezone=${GlobalVar.zone}&dark=${dark}`;
        try {
            window.open(
                link,
                LangUtil("注单历史"),
                "fullscreen = yes ,height=938, width=1500, top=300, left=200, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no"
            );
        } catch (e: any) {
            OpenLink(link);
        }
    }

    //搜寻
    onSearch() {
        page_home.showByKeyword(this.txtSearch);
    }

    destroyed() {
        super.destroyed();
    }
}
