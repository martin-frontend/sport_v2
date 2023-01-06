import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import NavigationMediator from "../mediator/NavigationMediator";
import NavigationProxy from "../proxy/NavigationProxy";
import LangUtil from "@/core/global/LangUtil";
import SelfProxy from "@/proxy/SelfProxy";
import getProxy from "@/core/global/getProxy";

@Component
export default class Navigation extends AbstractView {
    LangUtil = LangUtil;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    myProxy: NavigationProxy = getProxy(NavigationProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(NavigationMediator);
    }

    tagIcon = {
        inplay: "live",
        today: "today",
        future: "early",
        champion: "cup",
    };

    get loveCount() {
        let count = 0;
        for (const comp of this.pageData.lovematch) {
            count += comp.count;
        }
        return count;
    }

    onTagClick(tag: string) {
        // this.closeNav();
        // page_lobby.showByTag(tag);
    }

    onGetSubMenu(country_code: string) {
        this.myProxy.api_menu_subnav_country(country_code);
    }

    onShowCompetition(comp_id: number) {
        // this.closeNav();
        // page_lobby.showByCompetition(comp_id);
    }

    onShowCountry(country_code: string) {
        // this.closeNav();
        // page_lobby.showByCountry(country_code);
    }

    destroyed() {
        super.destroyed();
    }
}
