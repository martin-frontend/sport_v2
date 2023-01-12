import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import NavigationMediator from "../mediator/NavigationMediator";
import NavigationProxy from "../proxy/NavigationProxy";
import LangUtil from "@/core/global/LangUtil";
import SelfProxy from "@/proxy/SelfProxy";
import getProxy from "@/core/global/getProxy";
import page_home from "../../page_home";
import BetProxy from "@/proxy/BetProxy";

@Component
export default class Navigation extends AbstractView {
    LangUtil = LangUtil;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    betProxy:BetProxy = getProxy(BetProxy);
    myProxy: NavigationProxy = getProxy(NavigationProxy);
    pageData = this.myProxy.pageData;

    window = 0;

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

    get unsettledCount(){
        return 0;
    }

    onTagClick(tag: string) {
        // this.closeNav();
        page_home.showByTag(tag);
    }

    onMybet() {
        this.window = 1;
        //TODO
    }

    onGetSubMenu(country_code: string) {
        this.myProxy.api_menu_subnav_country(country_code);
    }

    onShowCompetition(comp_id: number) {
        // this.closeNav();
        page_home.showByCompetition(comp_id);
    }

    onShowCountry(country_code: string) {
        // this.closeNav();
        page_home.showByCountry(country_code);
    }

    @Watch("betProxy.pageData.list")
    onWatchMyBet(){
        if(this.betProxy.pageData.list.length > 0){
            this.window = 1;
        }else{
            this.window = 0;
        }
    }

    destroyed() {
        super.destroyed();
    }
}
