import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageRacingDetailMediator from "../mediator/PageRacingDetailMediator";
import PageRacingDetailProxy from "../proxy/PageRacingDetailProxy";
import LangUtil from "@/core/global/LangUtil";
import { dateFormat } from "@/core/global/Functions";
import Assets from "@/_skin001/assets/Assets";

@Component
export default class PageRacingDetail extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageRacingDetailProxy = this.getProxy(PageRacingDetailProxy);
    pageData = this.myProxy.pageData;
    selectedItem = 0;
    tab = 0;
    curMatchKey = this.pageData.curMatchKey;
    sportIcon = Assets.SportIcon;
    get curCompetition() {
        return this.pageData.competition_list.find((item: any) => item.competition_id == this.pageData.curCompetitionId);
    }

    getEventDate(date: any) {
        return dateFormat(new Date(date), "MM/dd");
    }

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
