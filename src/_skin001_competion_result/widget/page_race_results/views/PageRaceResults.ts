import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import PageRaceResultsMediator from "../mediator/PageRaceResultsMediator";
import PageRaceResultsProxy from "../proxy/PageRaceResultsProxy";
import LangUtil from "@/core/global/LangUtil";
import { getResponseIcon } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
@Component
export default class PageRaceResults extends AbstractView {
    LangUtil = LangUtil;
    getResponseIcon = getResponseIcon;
    @Prop() matche!: any;
    @Prop() competition_name!: any;
    GlobalVar = GlobalVar;
    myProxy!: PageRaceResultsProxy;

    pageData!: any;

    offsetTop = 0;

    rankOptions = {
        1: { title: "第一名", color: "#f64d55" },
        2: { title: "第二名", color: "#feba00" },
        3: { title: "第三名", color: "#a4a4a4" },
    };

    constructor() {
        super();
        puremvc.Facade.getInstance().registerProxy(new PageRaceResultsProxy(this.matche.id));
        puremvc.Facade.getInstance().registerMediator(new PageRaceResultsMediator(this.matche.id));
        this.myProxy = <any>puremvc.Facade.getInstance().retrieveProxy(this.matche.id);
        this.pageData = this.myProxy.pageData;
    }

    mounted() {
        // this.onWatchMarketMaintype();
        this.pageData.matche = this.matche;
        this.pageData.competitionName = this.competition_name;
        this.pageData.event_id = this.matche.id;
        this.myProxy.api_event_states(this.matche.id);
        this.myProxy.api_market_typelist(this.matche.id);
    }

    get ranking() {
        return this.matche.result.split(/[,,-]/);
    }

    get states(): any {
        return this.pageData.event_states[this.matche.id];
    }

    get markets(): any {
        return this.pageData.market_list[this.matche.id]?.fix_markets;
    }

    get placings() {
        // placings: {
        //     "2": 4,
        //     "4": 3,
        //     "7": 2,
        //     "8": 1
        // }
        return this.states?.results?.placings;
    }

    get selections() {
        return this.markets?.RB_WIN?.selections;
    }

    getSelections(id: any) {
        return this.selections?.find((item: any) => item.id == id);
    }

    onBack() {
        this.$router.replace("/page_matchResults");
    }

    onScroll(e: any) {
        this.offsetTop = e.target.scrollTop;
    }

    destroyed() {
        super.destroyed();
    }
}
