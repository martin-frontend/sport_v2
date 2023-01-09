import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import BetSlipSettledMediator from "../mediator/BetSlipSettledMediator";
import BetSlipSettledProxy from "../proxy/BetSlipSettledProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class BetSlipSettled extends AbstractView {
    LangUtil = LangUtil;
    myProxy: BetSlipSettledProxy = this.getProxy(BetSlipSettledProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(BetSlipSettledMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
