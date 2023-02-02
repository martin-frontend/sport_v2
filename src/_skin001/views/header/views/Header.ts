import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import HeaderMediator from "../mediator/HeaderMediator";
import HeaderProxy from "../proxy/HeaderProxy";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import GlobalVar from "@/core/global/GlobalVar";
import OpenLink from "@/core/global/OpenLink";
import page_home from "../../page_home";
import { isAndroid, isIOS } from "@/core/global/Functions";
import BlurUtil from "@/core/global/BlurUtil";
@Component
export default class Header extends AbstractView {
    LangUtil = LangUtil;
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: HeaderProxy = this.getProxy(HeaderProxy);
    pageData = this.myProxy.pageData;

    txtSearch = "";

    isShowSetting = false;

    constructor() {
        super(HeaderMediator);
    }

    @Watch("isShowSetting")
    onWatchSetting(){
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
        const iWidth = 1400;
        const iHeight = 650;
        const iTop = (window.screen.availHeight-30-iHeight)/2;
        const iLeft = (window.screen.availWidth-10-iWidth)/2;
        const dark = this.$vuetify.theme.dark;
        const link = `./skin001_competion_result.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}&dark=${dark}`;
        try {
            if (isIOS()) {
                const winHandler: any = window.open("", "_blank");
                winHandler.location.href = link;
            }else {
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
        const iWidth = 1400;
        const iHeight = 650;
        const iTop = (window.screen.availHeight-30-iHeight)/2;
        const iLeft = (window.screen.availWidth-10-iWidth)/2;
        const dark = this.$vuetify.theme.dark;
        const link = `./skin001_history_result.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}&dark=${dark}`;
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

    //搜寻
    onSearch() {
        page_home.showByKeyword(this.txtSearch);
    }

    destroyed() {
        super.destroyed();
    }
}
