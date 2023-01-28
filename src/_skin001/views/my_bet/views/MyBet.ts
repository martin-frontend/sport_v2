import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import MyBetMediator from "../mediator/MyBetMediator";
import LangUtil from "@/core/global/LangUtil";
import BetProxy from "@/proxy/BetProxy";

@Component
export default class MyBet extends AbstractView {
    LangUtil = LangUtil;
    myProxy: BetProxy = this.getProxy(BetProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(MyBetMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
