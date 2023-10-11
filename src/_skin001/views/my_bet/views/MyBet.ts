import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import MyBetMediator from "../mediator/MyBetMediator";
import LangUtil from "@/core/global/LangUtil";
import BetProxy from "@/proxy/BetProxy";

@Component
export default class MyBet extends AbstractView {
    LangUtil = LangUtil;
    myProxy: BetProxy = this.getProxy(BetProxy);
    pageData = this.myProxy.pageData;

    @Watch("pageData.betType")
    onBetTypeChange() {
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
