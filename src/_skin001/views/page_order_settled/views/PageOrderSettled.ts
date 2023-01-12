import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageOrderSettledMediator from "../mediator/PageOrderSettledMediator";
import PageOrderSettledProxy from "../proxy/PageOrderSettledProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class PageOrderSettled extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageOrderSettledProxy = this.getProxy(PageOrderSettledProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(PageOrderSettledMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
