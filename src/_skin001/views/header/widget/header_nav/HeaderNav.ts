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
import page_racing_home from "@/_skin001/views/page_racing_home";
import SportUtil from "@/core/global/SportUtil";
import BetProxy from "@/proxy/BetProxy";
import SvgaUtil from "@/core/global/SvgaUtil";

@Component
export default class HeaderNav extends AbstractView {
    LangUtil = LangUtil;
    myProxy: HeaderProxy = this.getProxy(HeaderProxy);
    betProxy: BetProxy = this.getProxy(BetProxy);
    pageData = this.myProxy.pageData;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    navProxy: NavigationProxy = getProxy(NavigationProxy);
    isShowSetting = false;
    sportIcon = Assets.SportIcon;
    tagIcon = Assets.TagIcon;
    sportSvag = Assets.SportSvga;
    resolveSvgaSrc = SvgaUtil.resolveSvgaSrc;

    destroyed() {
        super.destroyed();
    }

    get new_menu_subnav() {
        return this.navProxy.pageData.new_menu_subnav;
    }

    get sportIdArr() {
        return this.navProxy.pageData.sportIdArr;
    }

    get curSportId() {
        return this.homeProxy.listQueryComp.sport_id;
    }

    onSportClick(sport_id: number) {
        // if (sport_id == this.curSportId) return;

        // 球类 换 race
        if (SportUtil.isRaceEvent(sport_id) != SportUtil.isRaceEvent(this.curSportId)) {
            this.betProxy.initBetList();
        }

        if (!SportUtil.isRaceEvent(sport_id)) {
            page_home.showBySport(sport_id);
        } else {
            this.homeProxy.listQueryComp.sport_id = sport_id;
            page_racing_home.showBySport(sport_id);
        }
    }

    getTagNum(tag: string) {
        if (tag == "love") {
            return this.homeProxy.pageData.love_count;
        }
    }

    getSportSvga(sportId: any, active: boolean) {
        // @ts-ignore
        const { darkActive, darkInactive, lightActive, lightInactive } = this.sportSvag[sportId];
        if (active) {
            return this.$vuetify.theme.dark ? darkActive : lightActive;
        } else {
            return this.$vuetify.theme.dark ? darkInactive : lightInactive;
        }
    }
}
