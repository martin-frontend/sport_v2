import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import PageHomeProxy from "../../proxy/PageHomeProxy";
import page_home from "../..";
import GlobalVar from "@/core/global/GlobalVar";
import NavigationProxy from "@/_skin001/views/navigation/proxy/NavigationProxy";

@Component
export default class HomeHeader extends AbstractView {
    LangUtil = LangUtil;
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;

    getTitleName() {
        const { country, competition_id, tag, keyword } = this.listQueryComp;
        if (country) {
            const findItem = this.navProxy.pageData.new_menu_subnav[this.listQueryComp.sport_id]?.all_competition.find(
                (item: any) => item.country_code == country
            );
            if (findItem) {
                return findItem.country_name;
            }
        }
        if (keyword) {
            return LangUtil("搜索") + ": " + keyword;
        }
        if(tag) {
            if (tag == "love") {
                return LangUtil("关注赛事");
            } else {
                const curNav = this.navProxy.pageData.new_menu_subnav[this.listQueryComp.sport_id];
                if (!curNav) return "";
    
                if (curNav[tag]) {
                    return curNav?.[tag].name;
                } else {
                    const findItem = curNav.tags.find((item: any) => item.tag == tag);
                    return findItem?.name;
                }
            }
        }
        if (competition_id) {
            if (this.pageData.competition_list.length > 0) {
                return this.pageData.competition_list[0].competition_name;
            }
        }
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
        return this.myProxy.pageData.openIndexs.length == 0;
    }

    onTaggleOpen() {
        if (this.myProxy.pageData.isShowFilter) {
            this.myProxy.pageData.isOpenFilterIndexs = !this.myProxy.pageData.isOpenFilterIndexs;
            return;
        }

        if (this.checkExpansionPanels()) {
            this.myProxy.pageData.openIndexs = [0, 1, 2];
        } else {
            this.myProxy.pageData.openIndexs = [];
        }
    }

    onFilter() {
        this.myProxy.pageData.isShowFilter = !this.myProxy.pageData.isShowFilter;
    }
}
