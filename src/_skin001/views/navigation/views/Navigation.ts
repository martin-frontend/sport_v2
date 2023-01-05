import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import NavigationMediator from "../mediator/NavigationMediator";
import NavigationProxy from "../proxy/NavigationProxy";
import LangUtil from "@/core/global/LangUtil";
import SelfProxy from "@/proxy/SelfProxy";
import getProxy from "@/core/global/getProxy";

@Component
export default class Navigation extends AbstractView {
    LangUtil = LangUtil;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    myProxy: NavigationProxy = getProxy(NavigationProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(NavigationMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
