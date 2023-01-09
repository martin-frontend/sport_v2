import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import BetSlipUnsettledMediator from "../mediator/BetSlipUnsettledMediator";
import BetSlipUnsettledProxy from "../proxy/BetSlipUnsettledProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class BetSlipUnsettled extends AbstractView {
    LangUtil = LangUtil;
    myProxy: BetSlipUnsettledProxy = this.getProxy(BetSlipUnsettledProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(BetSlipUnsettledMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
