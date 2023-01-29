import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import NavigationMediator from "../mediator/NavigationMediator";
import NavigationProxy from "../proxy/NavigationProxy";
import LangUtil from "@/core/global/LangUtil";
import SelfProxy from "@/proxy/SelfProxy";
import getProxy from "@/core/global/getProxy";
import page_home from "../../page_home";
import BetProxy from "@/proxy/BetProxy";
import OrderUnsettledProxy from "@/proxy/OrderUnsettledProxy";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";
import DialogBetResultProxy from "../../dialog_bet_result/proxy/DialogBetResultProxy";

@Component
export default class Navigation extends AbstractView {
    LangUtil = LangUtil;
    betResultProxy: DialogBetResultProxy = getProxy(DialogBetResultProxy);
    selfProxy: SelfProxy = getProxy(SelfProxy);
    betProxy: BetProxy = getProxy(BetProxy);
    homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    orderUnsettledProxy: OrderUnsettledProxy = getProxy(OrderUnsettledProxy);
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

    get unsettledCount() {
        return this.orderUnsettledProxy.pageData.stats.total_count;
    }

    onTagClick(tag: string) {
        page_home.showByTag(tag);
        this.$emit("onChange");
    }

    onGetSubMenu(country_code: string) {
        this.myProxy.api_menu_subnav_country(country_code);
    }

    onShowCompetition(comp_id: number) {
        page_home.showByCompetition(comp_id);
        this.$emit("onChange");
    }

    onShowCountry(country_code: string) {
        page_home.showByCountry(country_code);
        this.$emit("onChange");
    }

    @Watch("betProxy.pageData.activeCount")
    onWatchMyBet() {
        if (!this.$vuetify.breakpoint.mobile) {
            if (this.betProxy.pageData.list.length > 0) {
                this.window = 1;
            } else {
                if(this.betResultProxy.pageData.bShow){
                    this.window = 3;
                }else{
                    this.window = 0;
                }
            }
        }
    }

    @Watch("betResultProxy.pageData.bShow")
    onWatchBetResultShow(){
        if(!this.betResultProxy.pageData.bShow){
            this.window = 0;
        }
    }

    destroyed() {
        super.destroyed();
    }
}
