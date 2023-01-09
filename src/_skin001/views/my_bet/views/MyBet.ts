import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import MyBetMediator from "../mediator/MyBetMediator";
import MyBetProxy from "../proxy/MyBetProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class MyBet extends AbstractView {
    LangUtil = LangUtil;
    myProxy: MyBetProxy = this.getProxy(MyBetProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(MyBetMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
