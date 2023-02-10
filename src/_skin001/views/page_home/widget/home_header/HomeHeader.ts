import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import PageHomeProxy from "../../proxy/PageHomeProxy";
import page_home from "../..";
import GlobalVar from "@/core/global/GlobalVar";

@Component
export default class HomeHeader extends AbstractView {
    LangUtil = LangUtil;
    homeProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;

    getTitleName() {
        const { country, competition_id, tag, keyword } = this.listQueryComp;
        if (country) {
            const findItem = this.pageData.menu_subnav.center.find((item) => item.country_code == country);
            if (findItem) {
                return findItem.country_name;
            }
        }
        if (competition_id) {
            if (this.pageData.competition_list.length > 0) {
                return this.pageData.competition_list[0].competition_name;
            }
        }
        if (keyword) {
            return LangUtil("搜索") + ": " + keyword;
        }
        if (tag == "love") {
            return LangUtil("关注赛事");
        } else {
            const findItem = this.pageData.menu_subnav.top.find((item) => item.tag == tag);
            if (findItem) {
                return findItem.name;
            }
        }
        return "";
    }

    @Watch("settingProxy.pageData.form.sort")
    onWatchSort() {
        this.listQueryComp.sort = this.settingProxy.pageData.form.sort;
        page_home.showEventList();
    }

    onQuerySort(sort: string) {
        this.settingProxy.pageData.form.sort = sort;
        this.settingProxy.api_user_set_user_setting();
    }
    //搜寻
    onSearch() {
        page_home.showByKeyword(this.listQueryComp.keyword);
    }
    //刷新
    onRefrush() {
        if (this.listQueryComp.tag == "love") {
            GlobalVar.loading1 = true;
            page_home.showByTag("love");
        } else {
            page_home.showEventList();
        }
    }
    //检测所有面板是否关闭
    checkExpansionPanels() {
        return this.homeProxy.pageData.openIndexs.length == 0;
    }

    onTaggleOpen() {
        if (this.checkExpansionPanels()) {
            this.homeProxy.pageData.openIndexs = [0, 1, 2];
        } else {
            this.homeProxy.pageData.openIndexs = [];
        }
    }
}
