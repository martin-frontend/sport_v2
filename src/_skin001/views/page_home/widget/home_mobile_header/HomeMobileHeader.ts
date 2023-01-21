import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import SelfProxy from "@/proxy/SelfProxy";
import PageHomeProxy from "../../proxy/PageHomeProxy";
import SettingProxy from "@/proxy/SettingProxy";
import page_home from "../..";
import dialog_setting from "@/_skin001/views/dialog_setting";
import page_live_list from "@/_skin001/views/page_live_list";
import page_order from "@/_skin001/views/page_order";

@Component
export default class HomeMobileHeader extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    selfProxy:SelfProxy = this.getProxy(SelfProxy);
    settingProxy:SettingProxy = this.getProxy(SettingProxy);
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;

    drawer = false;

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
    onOrder(){
        page_order.show();
    }
    // 打开设置页面
    onSetting(){
        dialog_setting.show();
    }
    // 打开热门直播页
    goLiveList(){
        page_live_list.show();
    }
}
