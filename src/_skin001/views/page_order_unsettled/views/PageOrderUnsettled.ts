import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageOrderUnsettledMediator from "../mediator/PageOrderUnsettledMediator";
import PageOrderUnsettledProxy from "../proxy/PageOrderUnsettledProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class PageOrderUnsettled extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageOrderUnsettledProxy = this.getProxy(PageOrderUnsettledProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(PageOrderUnsettledMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
