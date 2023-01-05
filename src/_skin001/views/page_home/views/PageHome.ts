import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageHomeMediator from "../mediator/PageHomeMediator";
import PageHomeProxy from "../proxy/PageHomeProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class PageHome extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(PageHomeMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
