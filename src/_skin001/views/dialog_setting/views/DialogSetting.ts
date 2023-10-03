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
import dialog_message_box from "../../dialog_message_box";
import { formatURLParam, logEnterTips } from "@/core/global/Functions";
import SelfProxy from "@/proxy/SelfProxy";
import NavigationProxy from "../../navigation/proxy/NavigationProxy";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";

@Component
export default class DialogSetting extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    myProxy: SettingProxy = this.getProxy(SettingProxy);
    pageData = this.myProxy.pageData;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    navProxy: NavigationProxy = getProxy(NavigationProxy);
    homeProxy: PageHomeProxy = getProxy(PageHomeProxy);

    user_type: number;
    able_to_choose_betterodds = this.selfProxy.userInfo.able_to_choose_betterodds;
    expanded = false;
    constructor() {
        super(DialogSettingMediator);
        const { user_type } = this.selfProxy.userInfo;
        this.user_type = user_type;
    }
    get bBetter() {
        return this.selfProxy.userInfo.better_odds == 1;
    }
    set bBetter(better: boolean) {
        better ? (this.selfProxy.userInfo.better_odds = 1) : (this.selfProxy.userInfo.better_odds = 0);
    }
    openCompetionResult() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        if (this.$vuetify.breakpoint.mobile) {
            this.$router.push("/competion_result");
        } else {
            const dark = this.$vuetify.theme.dark;
            const params = formatURLParam({
                dark,
                plat_id: GlobalVar.plat_id,
                timezone: GlobalVar.zone,
                MarketType_area: GlobalVar.MarketType_area,
            });
            const link = "./skin001_competion_result.html?" + params;
            OpenLink(link);
        }
    }

    @Watch("pageData.bShow")
    onWatchShow() {
        BlurUtil(this.pageData.bShow);
        if (!this.pageData.bShow) {
            const settingProxy: SettingProxy = getProxy(SettingProxy);
            settingProxy.api_user_set_user_setting();
        }
    }
    clickOdditem() {
        const idx = this.bBetter ? 1 : 0;
        window.localStorage.setItem("better_odds", idx.toString());
        this.selfProxy.userInfo.better_odds = idx;
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
        dialog_message_box.confirm({
            message: LangUtil("确定要重置吗？"),
            okFun: () => {
                setTimeout(() => {
                    this.myProxy.api_user_set_user_setting(true);
                    this.myProxy.resetForm();
                }, 1000);
            },
            thisObj: this,
        });
    }
    get isVisitor() {
        return !this.selfProxy.userInfo || this.selfProxy.userInfo.user_type == 2;
    }

    onAcceptChange(type: number) {
        this.pageData.form.accept_change = type;
    }
}
