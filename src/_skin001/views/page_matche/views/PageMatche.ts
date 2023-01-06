import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageMatcheMediator from "../mediator/PageMatcheMediator";
import PageMatcheProxy from "../proxy/PageMatcheProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class PageMatche extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageMatcheProxy = this.getProxy(PageMatcheProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(PageMatcheMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
