import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import SelfProxy from "@/proxy/SelfProxy";
import PageHomeProxy from "../../proxy/PageHomeProxy";
import SettingProxy from "@/proxy/SettingProxy";
import OpenLink from "@/core/global/OpenLink";
import page_home from "../..";
import dialog_setting from "@/_skin001/views/dialog_setting";
import page_live_list from "@/_skin001/views/page_live_list";
import page_order from "@/_skin001/views/page_order";
import BlurUtil from "@/core/global/BlurUtil";
import { amountFormat, formatURLParam } from "@/core/global/Functions";
import { EnumPostMessage } from "@/enum/EnumPostMessage";
import PlatConfig from "@/core/config/PlatConfig";

@Component
export default class HomeMobileHeader extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    amountFormat = amountFormat;
    PlatConfig = PlatConfig;
    selfProxy: SelfProxy = this.getProxy(SelfProxy);
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;

    getTagNum(tag: string) {
        if (tag == "love") {
            return this.pageData.love_count;
        } else {
            const findItem = this.pageData.menu_subnav.top.find((item) => item.tag == tag);
            return findItem?.num;
        }
    }

    onQuerySort(sort: string) {
        this.settingProxy.pageData.form.sort = sort;
        this.settingProxy.api_user_set_user_setting();
        this.listQueryComp.sort = sort;
        page_home.showEventList();
    }

    //搜寻
    onSearch() {
        page_home.showByKeyword(this.listQueryComp.keyword);
    }

    onQueryTagType(tag: string) {
        page_home.showByTag(tag);
    }
    // 打开注单历史
    onOrder() {
        page_order.show();
    }
    // 打开设置页面
    onSetting() {
        dialog_setting.show();
    }
    // 打开热门直播页
    goLiveList() {
        page_live_list.show();
    }

    onTopup() {
        if (window.parent) {
            window.parent.postMessage(EnumPostMessage.TOPUP, "*");
        }
    }
    openHelp() {
        // const dark = this.$vuetify.theme.dark;
        // const link = `./skin001_help.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}&dark=${dark}`;
        if (this.$vuetify.breakpoint.mobile) {
            this.$router.push("/page_help");
        } else {
            const dark = this.$vuetify.theme.dark;
            const params = formatURLParam({
                daynight_type: dark ? 2 : 1,
                plat_id: GlobalVar.plat_id,
                timezone: GlobalVar.zone,
            });
            const link = "./skin001_help.html?" + params;
            OpenLink(link);
        }
    }
    truncateToFirstTwo(value: string): string {
        let cleanedValue = value.replace(/[^0-9]/g, ""); // 移除所有非数字字符
        let result = "";

        if (cleanedValue.length >= 2) {
            result = cleanedValue.substring(0, 2);
        } else if (cleanedValue.length === 1) {
            result = cleanedValue + "0";
        } else {
            result = "00";
        }

        return result;
    }
}
