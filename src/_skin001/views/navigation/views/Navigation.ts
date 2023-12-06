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
import page_racing_home from "../../page_racing_home";
// import Assets from "@/_skin001/assets/Assets";

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
    // sportIcon = Assets.SportIcon;

    window = 0;

    constructor() {
        super(NavigationMediator);
    }

    // get loveCount() {
    //     let count = 0;
    //     for (const comp of this.pageData.lovematch) {
    //         count += comp.count;
    //     }
    //     return count;
    // }

    get unsettledCount() {
        return this.orderUnsettledProxy.pageData.stats.total_count;
    }

    // onTagClick(tag: string) {
    //     page_home.showByTag(tag);
    //     this.$emit("onChange");
    // }

    // onGetSubMenu(country_code: string) {
    //     this.myProxy.api_menu_subnav_country(country_code);
    // }

    // onShowCountry(country_code: string) {
    //     page_home.showByCountry(country_code);
    //     this.$emit("onChange");
    // }

    @Watch("betProxy.pageData.activeCount")
    onWatchMyBet() {
        if (this.betProxy.pageData.isLive) {
            return;
        }
        if (!this.$vuetify.breakpoint.mobile) {
            if (this.betResultProxy.pageData.bShow) {
                return;
            }
            if (this.betProxy.pageData.list.length > 0) {
                this.window = 1;
            } else {
                // if (this.betResultProxy.pageData.bShow) {
                //     this.window = 3;
                // } else {
                //     this.window = 0;
                // }
                this.window = 0;
            }
        }
    }

    @Watch("window")
    onWatchWindow(newVal: any, oldVal: any) {
        if (this.betProxy.pageData.isLive) {
            return;
        }
        // 进入未结算住单时
        if (newVal == 2) {
            this.orderUnsettledProxy.pageData.loading = true;
            this.orderUnsettledProxy.listQuery.unique = OrderUnsettledProxy.NAME;
            this.orderUnsettledProxy.init();
        }
        // 离开未结算住单时
        if (oldVal == 2) {
            this.orderUnsettledProxy.onReset();
            this.orderUnsettledProxy.clear();
            this.orderUnsettledProxy.listQuery.unique = "settleCount";
            this.orderUnsettledProxy.listQuery.cash_out_status = "";
            this.orderUnsettledProxy.api_user_orders_v3();
        }
        if (!this.$vuetify.breakpoint.mobile) {
            this.betProxy.pageData.isShowResultPanel = newVal == 3;
            if (oldVal == 3) {
                this.betResultProxy.pageData.bShow = false;
            }
        }
    }

    @Watch("betResultProxy.pageData.bShow")
    onWatchBetResultShow() {
        if (this.betProxy.pageData.isLive) {
            return;
        }
        if (this.betResultProxy.pageData.bShow) {
            this.window = 3;
        }
    }

    // @Watch("pageData.update_count")
    // onWatchCountryUpdate() {
    //     if (this.$vuetify.breakpoint.mobile) {
    //         this.$forceUpdate();
    //     }
    // }

    onExitOrderUnsettled() {
        this.window = 0;
    }

    destroyed() {
        super.destroyed();
    }

    onExitBetResult() {
        this.betResultProxy.pageData.bShow = false;
        this.betProxy.initBetList();
    }

    get betLength() {
        if (this.betProxy.pageData.isLive) return 0;
        return this.betProxy.pageData.list.length;
    }

    get new_menu_subnav() {
        return this.myProxy.pageData.new_menu_subnav;
    }

    // get curSportId() {
    //     return this.homeProxy.listQueryComp.sport_id;
    // }

    // get curSportNav() {
    //     return this.new_menu_subnav[this.curSportId];
    // }

    showRacing() {
        page_racing_home.show();
    }
}
