import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageLiveListMediator from "../mediator/PageLiveListMediator";
import PageLiveListProxy from "../proxy/PageLiveListProxy";
import LangUtil from "@/core/global/LangUtil";
import page_matche from "../../page_matche";

@Component
export default class PageLiveList extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageLiveListProxy = this.getProxy(PageLiveListProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(PageLiveListMediator);
    }

    onChange(item:any){
        page_matche.show(item.id);
    }

    onBack() {
        this.$router.replace("/page_home");
    }

    destroyed() {
        super.destroyed();
    }
}
