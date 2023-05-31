import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import PageGameResultsMediator from "../mediator/PageGameResultsMediator";
import PageGameResultsProxy from "../proxy/PageGameResultsProxy";
import LangUtil from "@/core/global/LangUtil";
import { getResponseIcon } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
@Component
export default class PageGameResults extends AbstractView {
    LangUtil = LangUtil;
    getResponseIcon = getResponseIcon;
    @Prop() matche!: any;
    @Prop() competition_name!: any;
    GlobalVar = GlobalVar;
    myProxy!: PageGameResultsProxy;

    pageData!: any;

    offsetTop = 0;

    constructor() {
        super();
        puremvc.Facade.getInstance().registerProxy(new PageGameResultsProxy(this.matche.id));
        puremvc.Facade.getInstance().registerMediator(new PageGameResultsMediator(this.matche.id));
        this.myProxy = <any>puremvc.Facade.getInstance().retrieveProxy(this.matche.id);
        this.pageData = this.myProxy.pageData;
    }
    transTitle(title: any) {
        const matches = this.matche;
        if (!matches) {
            return title;
        }
        const homestr = LangUtil("主队").trim();
        const awaystr = LangUtil("客队").trim();
        const { home_team, away_team } = matches;
        title = title.replace(new RegExp(homestr, "ig"), home_team).replace(new RegExp(awaystr, "ig"), away_team);
        return title;
    }
    transRs(title: any) {
        const matches = this.matche;
        if (!matches || !title) {
            return title;
        }
        const homestr = LangUtil("主").trim() + "-";
        const awaystr = LangUtil("客").trim() + "-";
        const { home_team, away_team } = matches;
        title = title
            .toString()
            .replace(new RegExp(homestr, "ig"), home_team + "-")
            .replace(new RegExp(awaystr, "ig"), away_team + "-");
        return title;
    }
    mounted() {
        // this.onWatchMarketMaintype();
        this.pageData.matche = this.matche;
        this.pageData.competitionName = this.competition_name;
        this.myProxy.api_event_states(this.matche.id);
    }

    get states(): any {
        return this.pageData.event_states[0];
    }

    get goalsValue(): number[] {
        return this.states.goals_ft.split("-").map((item: any) => parseInt(item));
    }

    get goals_ot_Value(): number[] {
        return this.states.goals_ot.split("-").map((item: any) => parseInt(item));
    }

    get goals_pk_Value(): number[] {
        return this.states.goals_pk.split("-").map((item: any) => parseInt(item));
    }

    /**盘口 筛选 */
    get marketTypeOptions() {
        return this.myProxy.marketTypeOptions;
    }

    /**是否显示全场比分，or加时比分 */
    isShowFullScore(match_phase: string): boolean {
        const arr = ["-", "1H", "HT", "2H", "FT"];
        return arr.includes(match_phase);
    }
    /**是否显示点球比分 */
    isShowPK(match_phase: string): boolean {
        const arr = ["PK", "PK FT"];
        return arr.includes(match_phase);
    }
    split_goals(goals: string) {
        const goalarr = goals.split("-");
        return goalarr;
    }

    onBack() {
        this.$router.replace("/page_matchResults");
    }

    onScroll(e: any) {
        this.offsetTop = e.target.scrollTop;
    }

    //赛况 盘口 比分
    onResultType(type: any) {
        this.pageData.isActive = type;
    }

    //统计 阵容 时间线
    onAnimationType(type: any) {
        this.pageData.animationType = type;
    }

    onMarketType(market_type: number) {
        this.myProxy.listQueryMarket.market_type = market_type;
        this.pageData.selectedMarketType = this.pageData.marketType.filter((el: { category: number[] }) =>
            el.category.includes(market_type)
        );
        console.warn("onMarketType>>", this.pageData.marketType, market_type);
    }

    get scores(): any {
        if (this.states) {
            if (["1H", "HT"].includes(this.states.match_phase)) {
                return this.htScores;
            } else if (["2H", "FT"].includes(this.states.match_phase)) {
                return this.ftScores;
            } else if (["1H OT", "OT HT"].includes(this.states.match_phase)) {
                return this.othtScores;
            } else if (["2H OT", "OT FT"].includes(this.states.match_phase)) {
                return this.otScores;
            } else if (["PK", "PK FT"].includes(this.states.match_phase)) {
                return this.allScores;
            }
        }
    }

    htScores = {
        goals_ht: LangUtil("上半场比分"),
        corners_ht: LangUtil("上半场角球"),
    };

    ftScores = {
        goals_ht: LangUtil("上半场比分"),
        corners_ht: LangUtil("上半场角球"),
        goals_ft: LangUtil("全场比分"),
        corners_ft: LangUtil("全场角球"),
    };

    othtScores = {
        goals_ht: LangUtil("上半场比分"),
        corners_ht: LangUtil("上半场角球"),
        goals_ft: LangUtil("全场比分"),
        corners_ft: LangUtil("全场角球"),
        goals_otht: LangUtil("加时-上半场比分"),
        corners_otht: LangUtil("加时-上半场角球"),
    };

    otScores = {
        goals_ht: LangUtil("上半场比分"),
        corners_ht: LangUtil("上半场角球"),
        goals_ft: LangUtil("全场比分"),
        corners_ft: LangUtil("全场角球"),
        goals_otht: LangUtil("加时-上半场比分"),
        corners_otht: LangUtil("加时-上半场角球"),
        goals_ot: LangUtil("加时-全场比分"),
        corners_ot: LangUtil("加时-全场角球"),
    };

    allScores = {
        goals_ht: LangUtil("上半场比分"),
        corners_ht: LangUtil("上半场角球"),
        goals_ft: LangUtil("全场比分"),
        corners_ft: LangUtil("全场角球"),
        goals_otht: LangUtil("加时-上半场比分"),
        corners_otht: LangUtil("加时-上半场角球"),
        goals_ot: LangUtil("加时-全场比分"),
        corners_ot: LangUtil("加时-全场角球"),
        goals_pk: LangUtil("点球比分"),
    };

    destroyed() {
        super.destroyed();
    }
}
