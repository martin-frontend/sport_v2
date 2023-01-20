import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageLiveListMediator from "../mediator/PageLiveListMediator";
import PageLiveListProxy from "../proxy/PageLiveListProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class PageLiveList extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageLiveListProxy = this.getProxy(PageLiveListProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(PageLiveListMediator);
    }

    onBack() {
        this.$router.replace("/page_home");
    }

    destroyed() {
        super.destroyed();
    }
}
