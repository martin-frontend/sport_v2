import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import HeaderMediator from "../mediator/HeaderMediator";
import HeaderProxy from "../proxy/HeaderProxy";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import GlobalVar from "@/core/global/GlobalVar";
import OpenLink from "@/core/global/OpenLink";
import page_home from "../../page_home";
import { formatURLParam, isAndroid, isIOS, logEnterTips } from "@/core/global/Functions";
import BlurUtil from "@/core/global/BlurUtil";
import dialog_setting from "../../dialog_setting";
import SelfProxy from "@/proxy/SelfProxy";
import getProxy from "@/core/global/getProxy";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";
import SportUtil from "@/core/global/SportUtil";
import page_racing_home from "../../page_racing_home";

@Component
export default class Header extends AbstractView {
    LangUtil = LangUtil;
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: HeaderProxy = this.getProxy(HeaderProxy);
    pageData = this.myProxy.pageData;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    txtSearch = "";
    isShowSetting = false;
    user_type: any;

    constructor() {
        super(HeaderMediator);
        const { user_type } = this.selfProxy.userInfo;
        this.user_type = user_type;
    }

    @Watch("isShowSetting")
    onWatchSetting() {
        BlurUtil(this.isShowSetting);
    }

    onMarketTypeArea(value: any) {
        GlobalVar.MarketType_area = value;
        this.settingProxy.pageData.form.MarketType_area = value;
        this.settingProxy.api_user_set_user_setting();
    }

    onSettingSave(value: any) {
        if (!value) {
            this.settingProxy.api_user_set_user_setting();
        }
    }
    openCompetionResult() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        const iWidth = 1400;
        const iHeight = 650;
        const iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        const iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        const dark = this.$vuetify.theme.dark;
        const params = formatURLParam({
            daynight_type: dark ? 2 : 1,
            plat_id: GlobalVar.plat_id,
            timezone: GlobalVar.zone,
            MarketType_area: GlobalVar.MarketType_area,
        });
        const link = "./skin001_competion_result.html?" + params;
        // const link = `./skin001_competion_result.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}&dark=${dark}`;
        try {
            if (isIOS()) {
                const winHandler: any = window.open("", "_blank");
                winHandler.location.href = link;
            } else {
                window.open(
                    link,
                    LangUtil("赛果"),
                    `height=${iHeight}, width=${iWidth}, top=${iTop}, left=${iLeft}, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no`
                );
            }
        } catch (e: any) {
            OpenLink(link);
        }
    }
    openHistoryResult() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }

        const iWidth = 1400;
        const iHeight = 650;
        const iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        const iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        const dark = this.$vuetify.theme.dark;
        const params = formatURLParam({
            daynight_type: dark ? 2 : 1,
            plat_id: GlobalVar.plat_id,
            timezone: GlobalVar.zone,
            MarketType_area: GlobalVar.MarketType_area,
        });
        const link = "./skin001_history_result.html?" + params;
        // const link = `./skin001_history_result.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}&dark=${dark}`;
        try {
            window.open(
                link,
                LangUtil("注单历史"),
                `height=${iHeight}, width=${iWidth}, top=${iTop}, left=${iLeft}, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no`
            );
        } catch (e: any) {
            OpenLink(link);
        }
    }
    openHelp() {
        const iWidth = 1400;
        const iHeight = 650;
        const iTop = (window.screen.availHeight - 30 - iHeight) / 2;
        const iLeft = (window.screen.availWidth - 10 - iWidth) / 2;
        const dark = this.$vuetify.theme.dark;
        const params = formatURLParam({ daynight_type: dark ? 2 : 1, plat_id: GlobalVar.plat_id, timezone: GlobalVar.zone });
        const link = "./skin001_help.html?" + params;
        // const link = `./skin001_help.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}&dark=${dark}`;
        try {
            window.open(
                link,
                LangUtil("帮助中心"),
                `height=${iHeight}, width=${iWidth}, top=${iTop}, left=${iLeft}, toolbar=no, menubar=no, scrollbars=yes, resizable=no,location=no, status=no`
            );
        } catch (e: any) {
            OpenLink(link);
        }
    }

    //搜寻
    onSearch() {
        const { sport_id } = this.homeProxy.listQueryComp;
        if (!SportUtil.isRaceEvent(sport_id)) {
            page_home.showByKeyword(this.txtSearch);
        } else {
            page_racing_home.showByKeyword(this.txtSearch);
        }
    }

    get searchPlaceholder() {
        const { sport_id } = this.homeProxy.listQueryComp;
        return !SportUtil.isRaceEvent(sport_id) ? LangUtil("搜索联赛或球队名称") : LangUtil("搜索联赛");
    }

    onSetting() {
        dialog_setting.show();
    }

    destroyed() {
        super.destroyed();
    }
}
