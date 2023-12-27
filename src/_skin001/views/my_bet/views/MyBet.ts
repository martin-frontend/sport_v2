import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import MyBetMediator from "../mediator/MyBetMediator";
import LangUtil from "@/core/global/LangUtil";
import BetProxy from "@/proxy/BetProxy";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";
import SportUtil from "@/core/global/SportUtil";

@Component
export default class MyBet extends AbstractView {
    LangUtil = LangUtil;
    myProxy: BetProxy = this.getProxy(BetProxy);
    homeProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    tab: any = null;
    isRaceEvent = SportUtil.isRaceEvent;

    get curSportId() {
        return this.homeProxy.listQueryComp.sport_id;
    }

    @Watch("pageData.betType")
    onBetTypeChange(val: string) {
        if (val === "single") {
            this.tab = 0;
        } else if (val === "parlay") {
            this.tab = 1;
        } else {
            this.tab = null;
        }

        /**投注完后等待api回传结果时更换标签，不跳转确认订单页 */
        if (this.pageData.loading && !this.pageData.isContinueBetting) {
            this.pageData.isContinueBetting = true;
        }
        this.myProxy.initBetList(true);
    }
    constructor() {
        super(MyBetMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
