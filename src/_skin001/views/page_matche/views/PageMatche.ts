import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageMatcheMediator from "../mediator/PageMatcheMediator";
import PageMatcheProxy from "../proxy/PageMatcheProxy";
import LangUtil from "@/core/global/LangUtil";
import MatcheProxy from "../../matche/proxy/MatcheProxy";
import { dateFormat, getDateByTimeZone, getResponseIcon } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import live from "../../live";

@Component
export default class PageMatche extends AbstractView {
    LangUtil = LangUtil;
    getResponseIcon = getResponseIcon;
    matcheProxy: MatcheProxy = this.getProxy(MatcheProxy);
    myProxy: PageMatcheProxy = this.getProxy(PageMatcheProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(PageMatcheMediator);
    }

    getCompetitionName() {
        return this.matcheProxy.pageData.competition_list[0]?.competition_name;
    }

    @Watch("matcheProxy.pageData.competition_list")
    onWatchMatche() {
        const competition_id = this.matcheProxy.pageData.competition_list[0]?.competition_id;
        if (competition_id) {
            console.warn("competition_id: ", competition_id)
            this.myProxy.api_event_list(competition_id);
        }
    }

    start_time(matche:any) {
        const timearr = <any>{};
        timearr.day = dateFormat(getDateByTimeZone(matche.sb_time * 1000, GlobalVar.zone), "MM/dd");
        timearr.min = dateFormat(getDateByTimeZone(matche.sb_time * 1000, GlobalVar.zone), "hh:mm");
        return timearr;
    }
    clickitem(matche:any){
        live.init(matche.id);
        matche.init(matche.id);
    }

    get currIndex() {
        return this.pageData.competition_list[0]?.matches.findIndex((item) => item.id == <any>this.matcheProxy.listQueryComp.event_id);
    }

    get matches(){
        return this.pageData.competition_list[0]?.matches;
    }

    onBack() {
        this.$router.replace("/page_home");
    }

    destroyed() {
        super.destroyed();
    }
}
