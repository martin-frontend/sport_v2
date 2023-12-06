import Assets from "@/_skin001/assets/Assets";
import PageHomeProxy from "@/_skin001/views/page_home/proxy/PageHomeProxy";
import AbstractView from "@/core/abstract/AbstractView";
import LangUtil from "@/core/global/LangUtil";
import { Watch, Component } from "vue-property-decorator";
import HeaderProxy from "../../proxy/HeaderProxy";
import SelfProxy from "@/proxy/SelfProxy";
import NavigationProxy from "@/_skin001/views/navigation/proxy/NavigationProxy";
import getProxy from "@/core/global/getProxy";
import page_home from "@/_skin001/views/page_home";

@Component
export default class HeaderNav extends AbstractView {
    LangUtil = LangUtil;
    myProxy: HeaderProxy = this.getProxy(HeaderProxy);
    pageData = this.myProxy.pageData;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    txtSearch = "";
    homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    navProxy: NavigationProxy = getProxy(NavigationProxy);
    isShowSetting = false;
    user_type: any;
    sportIcon = Assets.SportIcon;
    tagIcon = Assets.TagIcon;

    destroyed() {
        super.destroyed();
    }

    get new_menu_subnav() {
        return this.navProxy.pageData.new_menu_subnav;
    }

    get curSportId() {
        return this.homeProxy.listQueryComp.sport_id;
    }

    onSportClick(sport_id: any) {
        if (!this.isRaceSport(sport_id)) {
            page_home.showBySport(sport_id);
        }
    }

    getTagNum(tag: string) {
        if (tag == "love") {
            return this.homeProxy.pageData.love_count;
        }
    }

    isRaceSport(sport_id: any) {
        return [7, 8].includes(Number(sport_id));
    }
}
