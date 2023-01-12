import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageOrderUnsettledMediator from "../mediator/PageOrderUnsettledMediator";
import LangUtil from "@/core/global/LangUtil";
import OrderUnsettledProxy from "@/proxy/OrderUnsettledProxy";

@Component
export default class PageOrderUnsettled extends AbstractView {
    LangUtil = LangUtil;
    myProxy: OrderUnsettledProxy = this.getProxy(OrderUnsettledProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(PageOrderUnsettledMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
