import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageMatcheMediator from "../mediator/PageMatcheMediator";
import PageMatcheProxy from "../proxy/PageMatcheProxy";
import LangUtil from "@/core/global/LangUtil";
import MatcheProxy from "../../matche/proxy/MatcheProxy";
import { dateFormat, formatURLParam, getDateByTimeZone, getResponseIcon } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import live from "../../live";
import page_order from "../../page_order";
import OpenLink from "@/core/global/OpenLink";
import BlurUtil from "@/core/global/BlurUtil";
import matche from "../../matche";
import LiveProxy from "../../live/proxy/LiveProxy";

@Component
export default class PageMatche extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    getResponseIcon = getResponseIcon;
    liveProxy: LiveProxy = this.getProxy(LiveProxy);
    matcheProxy: MatcheProxy = this.getProxy(MatcheProxy);
    myProxy: PageMatcheProxy = this.getProxy(PageMatcheProxy);
    pageData = this.myProxy.pageData;

    scrollTop = 0;

    constructor() {
        super(PageMatcheMediator);
    }

    onScroll(e: any) {
        this.scrollTop = e.target.scrollTop;
    }

    @Watch("pageData.isShowList")
    onWatchShowList() {
        BlurUtil(this.pageData.isShowList, "div_content");
    }

    getCompetitionName() {
        return this.matcheProxy.pageData.competition_list[0]?.competition_name;
    }

    @Watch("matcheProxy.pageData.competition_list")
    onWatchMatche() {
        const competition_id = this.matcheProxy.pageData.competition_list[0]?.competition_id;
        if (competition_id) {
            console.warn("competition_id: ", competition_id);
            this.myProxy.api_event_list(competition_id);
        }
    }

    start_time(matche: any) {
        const timearr = <any>{};
        timearr.day = dateFormat(getDateByTimeZone(matche.sb_time * 1000, GlobalVar.zone), "MM/dd");
        timearr.min = dateFormat(getDateByTimeZone(matche.sb_time * 1000, GlobalVar.zone), "hh:mm");
        return timearr;
    }
    clickitem(m: any) {
        live.init(m.id);
        matche.init(m.id);
    }

    get currIndex() {
        return this.pageData.competition_list[0]?.matches.findIndex((item) => item.id == <any>this.matcheProxy.listQueryComp.event_id);
    }

    get matches() {
        return this.pageData.competition_list[0]?.matches;
    }

    getCurrMatche() {
        return this.matcheProxy.pageData.competition_list[0]?.matches[0];
    }
    getHomeName() {
        return this.matcheProxy.pageData.competition_list[0]?.matches[0]?.home_team;
    }
    getAwayName() {
        return this.matcheProxy.pageData.competition_list[0]?.matches[0]?.away_team;
    }
    getStates() {
        return this.liveProxy.pageData.event_states[0];
    }
    get goalsValue(): number[] {
        if (this.getStates()?.goals_ft) {
            return this.getStates()
                .goals_ft.split("-")
                .map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    get goals_ot_Value(): number[] {
        if (this.getStates()?.goals_ot) {
            return this.getStates()
                .goals_ot.split("-")
                .map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    get goals_pk_Value(): number[] {
        if (this.getStates()?.goals_pk) {
            return this.getStates()
                .goals_pk.split("-")
                .map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    /**是否显示全场比分，or加时比分 */
    isShowFullScore(): boolean {
        const arr = ["-", "1H", "HT", "2H", "FT"];
        return !arr.includes(this.getStates().match_phase);
    }
    /**是否显示点球比分 */
    isShowPK(): boolean {
        const arr = ["PK", "PK FT"];
        return arr.includes(this.getStates().match_phase);
    }

    // 打开注单历史
    onOrder() {
        page_order.show();
    }

    onBack() {
        this.$router.replace("/page_home");
    }
    openHelp() {
        const dark = this.$vuetify.theme.dark;
        const params = formatURLParam({ dark, plat_id: GlobalVar.plat_id, timezone: GlobalVar.zone });
        const link = "./skin001_help.html?" + params;
        // const link = `./skin001_help.html${window.location.search}&plat_id=${GlobalVar.plat_id}&timezone=${GlobalVar.zone}&dark=${dark}`;
        OpenLink(link);
    }

    destroyed() {
        super.destroyed();
    }
}
