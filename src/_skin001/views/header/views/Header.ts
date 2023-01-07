import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import HeaderMediator from "../mediator/HeaderMediator";
import HeaderProxy from "../proxy/HeaderProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class Header extends AbstractView {
    LangUtil = LangUtil;
    myProxy: HeaderProxy = this.getProxy(HeaderProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(HeaderMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
