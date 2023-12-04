import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageRacingDetailMediator from "../mediator/PageRacingDetailMediator";
import PageRacingDetailProxy from "../proxy/PageRacingDetailProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class PageRacingDetail extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageRacingDetailProxy = this.getProxy(PageRacingDetailProxy);
    pageData = this.myProxy.pageData;
    selectedItem = 0;
    tab = 0;

    constructor() {
        super(PageRacingDetailMediator);
    }

    onBack() {
        this.$router.back();
    }

    destroyed() {
        super.destroyed();
    }
}
