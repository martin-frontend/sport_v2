import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageRacingDetailMediator from "../mediator/PageRacingDetailMediator";
import PageRacingDetailProxy from "../proxy/PageRacingDetailProxy";
import LangUtil from "@/core/global/LangUtil";
import { dateFormat, getDateByTimeZone } from "@/core/global/Functions";
import Assets from "@/_skin001/assets/Assets";
import GlobalVar from "@/core/global/GlobalVar";

@Component
export default class PageRacingDetail extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageRacingDetailProxy = this.getProxy(PageRacingDetailProxy);
    pageData = this.myProxy.pageData;
    selectedItem = 0;
    sportIcon = Assets.SportIcon;
    mobileWindow = 0;

    get mobileTagOptions() {
        if (this.states?.match_phase == "DONE") {
            return ["赛果", "投注盘"];
        }
        return ["投注盘"];
    }

    constructor() {
        super(PageRacingDetailMediator);
    }

    created() {
        if (!this.pageData.competitionId) {
            this.$router.push("/page_racing_home");
        }
        this.mobileWindow = 0;
    }

    getResultStr(match_phase: string) {
        const type: any = {
            OPEN: "",
            DONE: "完成",
            INTERIM: "临时",
            ABANDONED: "放弃",
            FINAL: "最后",
            CLOSED: "关闭",
        };
        return LangUtil(type[match_phase]);
    }

    get curCompetition() {
        this.selectedItem = this.pageData.competition_list.findIndex((item: any) => item.competition_id == this.pageData.competitionId);
        if (this.selectedItem > -1) {
            return this.pageData.competition_list[this.selectedItem];
        }
        return {};
    }

    get match() {
        return this.curCompetition.matches?.[this.pageData.matchKey];
    }

    /**进程 */
    get states() {
        return this.pageData.eventStatesByEventId[this.match?.id];
    }

    /**盘口 固陪*/
    get markets() {
        return this.pageData.marketListByEventId[this.match?.id]?.fix_markets;
    }

    getStartTime(start_time_timestamp: any) {
        return dateFormat(getDateByTimeZone(start_time_timestamp * 1000, <any>GlobalVar.zone), "hh:mm");
    }

    getEventDate(date: any) {
        return dateFormat(new Date(date), "MM/dd");
    }

    onTagClick(key: any) {
        this.pageData.loading = true;
        this.pageData.matchKey = key;
        this.myProxy.getMarketAndStates();
    }

    onChangeCompetion(val: any) {
        this.pageData.competitionId = this.pageData.competition_list[val].competition_id;
        this.pageData.matchKey = "R1";
        this.pageData.loading = true;
        this.myProxy.getMarketAndStates();
    }

    onBack() {
        this.$router.back();
    }

    destroyed() {
        super.destroyed();
    }
}
