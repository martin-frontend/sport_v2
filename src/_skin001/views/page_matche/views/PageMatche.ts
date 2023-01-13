import Vue from "vue";
import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageMatcheMediator from "../mediator/PageMatcheMediator";
import PageMatcheProxy from "../proxy/PageMatcheProxy";
import LangUtil from "@/core/global/LangUtil";
import PlatConfig from "@/core/config/PlatConfig";
import { getResponseIcon, getDateByTimeZone, dateFormat, formatEventTime } from "@/core/global/Functions";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import BetProxy from "@/proxy/BetProxy";

@Component
export default class PageMatche extends AbstractView {
    LangUtil = LangUtil;
    getResponseIcon = getResponseIcon;
    getDateByTimeZone = getDateByTimeZone;
    dateFormat = dateFormat;
    PlatConfig = PlatConfig;
    GlobalVar = GlobalVar;
    betProxy: BetProxy = getProxy(BetProxy);
    myProxy: PageMatcheProxy = getProxy(PageMatcheProxy);
    // rightPanelProxy: RightPanelProxy = this.getProxy(RightPanelProxy);
    pageData = this.myProxy.pageData;
    showMenu = false;
    //倒数计时
    day: any = "0";
    hr: any = "00";
    min: any = "00";
    sec: any = "00";
    start_in_sec = 0;
    bShowOthercompetition = false;
    bShowFloatBtn = false;
    bShowCompetingTime = false;

    offsetTop = 0;

    constructor() {
        super(PageMatcheMediator);
    }

    @Watch("$router.currentRoute.query")
    onWatchId() {
        this.myProxy.onRegister();
        //@ts-ignore
        this.$refs.divScroll.scrollTo(0, 0);
    }

    mounted() {
        this.onWatchWidth();
        this.onWatchHeight();
        // const divScroll: any = this.$refs.divScroll;
        // if (divScroll) {
        //     this.$nextTick(() => {
        //         ScrollUtil(divScroll, this.pageData.scrollOffset, 0);
        //     });
        //     divScroll.addEventListener("scroll", this.scrollHandle, true);
        // }
    }

    private scrollHandle() {
        const divScroll = this.$refs.divScroll;
        if (divScroll) {
            //@ts-ignore
            this.bShowFloatBtn = divScroll.scrollTop > 30;
            //@ts-ignore
            this.bShowCompetingTime = divScroll.scrollTop > 160;
            //@ts-ignore
            if (divScroll.scrollTop > 0) this.pageData.scrollOffset = divScroll.scrollTop;
        }
    }

    goTop() {
        const divScroll = this.$refs.divScroll;
        // ScrollUtil(divScroll, 0);
    }

    goLive(data: any, matche: any) {
        const vuetify = Vue.vuetify;
        if (vuetify.framework.breakpoint.mobile) {
            this.pageData.isShowVideo = true;
        }
        // PC 直播
        // this.rightPanelProxy.pageData.data.isShowVideo = true;
        // this.rightPanelProxy.pageData.data.isShowAnimation = false;
        // this.rightPanelProxy.pageData.data.liveUrl = "";
        // this.rightPanelProxy.pageData.away_team = matche.away_team;
        // this.rightPanelProxy.pageData.home_team = matche.home_team;
        // this.myProxy.api_event_live_url(data.match_id);
        // // 关热门直播按钮
        // this.rightPanelProxy.pageData.buttonsShow = false;
    }

    goAnimation(matche: any) {
        const vuetify = Vue.vuetify;
        // this.rightPanelProxy.pageData.data.isShowVideo = false;
        // mobile 动画
        if (vuetify.framework.breakpoint.mobile) {
            this.pageData.isShowAnimation = true;
            this.pageData.anim_id = matche.animation_id;
        } else {
            // 1: 有动画数据 2:无动画数据
            // if (matche.animation_status == 2) {
            //     this.rightPanelProxy.pageData.data.isShowAnimation = false;
            // } else {
            //     this.rightPanelProxy.pageData.data.liveUrl = "";
            //     this.rightPanelProxy.pageData.data.isShowAnimation = true;
            // }
        }
        // rightPanel 动画
        // this.rightPanelProxy.pageData.away_team = matche.away_team;
        // this.rightPanelProxy.pageData.home_team = matche.home_team;
        // this.rightPanelProxy.pageData.data.anim_id = matche.animation_id;
        // // 关热门直播按钮
        // this.rightPanelProxy.pageData.buttonsShow = false;
    }

    @Watch("$vuetify.breakpoint.height")
    onWatchHeight() {
        this.$nextTick(() => {
            const divScroll: HTMLElement = <any>this.$refs.divScroll;
            if (divScroll) {
                let height = document.body.clientHeight - divScroll.getBoundingClientRect().top;
                if (this.$vuetify.breakpoint.mobile && this.betProxy.pageData.list.length > 0) {
                    height -= 45;
                }
                divScroll.style.height = height + "px";
                divScroll.style.maxHeight = height + "px";
                console.log(">>>>>>>>>height:", height);
            }
        });
    }

    @Watch("betProxy.pageData.list")
    onWatchBet() {
        this.onWatchHeight();
    }

    /**全部 固赔 交易所*/
    typeOptions = {
        all: LangUtil("全部"),
        fix: LangUtil("固定赔率"),
        // exchange: LangUtil("交易所"),
    };
    /**盘口 筛选 */
    get marketTypeOptions() {
        return this.myProxy.marketTypeOptions;
    }

    @Watch("$vuetify.breakpoint.width")
    onWatchWidth() {
        const pctag: HTMLElement = <any>this.$refs.pctag;
        if (pctag) {
            pctag.style.width = (document.body.clientWidth - 540) + "px";
        }
    }

    get start_time() {
        return formatEventTime(dateFormat(getDateByTimeZone(this.pageData.start_time * 1000, GlobalVar.zone), "yyyy-MM-dd hh:mm:ss"));
    }

    getStartTime(time: number) {
        return formatEventTime(dateFormat(getDateByTimeZone(time * 1000, GlobalVar.zone), "yyyy-MM-dd hh:mm:ss"));
    }

    get start() {
        if (this.pageData.competition_list[0]) {
            this.start_in_sec = this.pageData.start_time - GlobalVar.server_time;
            this.day = Math.floor(this.start_in_sec / 60 / 60 / 24);
            this.hr = Math.floor(this.start_in_sec / 60 / 60 - this.day * 24);
            this.min = Math.floor((this.start_in_sec / 60) % 60);
            this.sec = Math.floor(this.start_in_sec % 60);
            this.day = this.day > 9 ? this.day + "" : "0" + this.day;
            this.hr = this.hr > 9 ? this.hr + "" : "0" + this.hr;
            this.min = this.min > 9 ? this.min + "" : "0" + this.min;
            this.sec = this.sec > 9 ? this.sec + "" : "0" + this.sec;
            return this.start_in_sec > 0 ? true : false;
        }
    }

    get isProduction() {
        return process.env.VUE_APP_ENV === "production";
    }

    get competition() {
        return this.pageData.competition_list[0] || {};
    }

    get matche(): any {
        if (this.pageData.competition_list[0]) {
            return this.pageData.competition_list[0].matches[0];
        }
        return {};
    }

    get states(): any {
        return this.pageData.event_states.find((item) => item.event_id == this.matche.id) || {};
        // return this.pageData.event_states[0] || {};
    }

    getStatesByEventId(event_id: number) {
        return this.pageData.event_states.find((item) => item.event_id == event_id);
    }

    get goalsValue(): number[] {
        if (this.states) {
            return this.states.goals_ft.split("-").map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    get goals_ot_Value(): number[] {
        console.warn(">>>>>", this.states);
        if (this.states) {
            return this.states.goals_ot.split("-").map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    get goals_pk_Value(): number[] {
        if (this.states) {
            return this.states.goals_pk.split("-").map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    split_goals(goals: string) {
        const goalarr = goals.split("-");
        return goalarr;
    }
    /**是否显示全场比分，or加时比分 */
    isShowFullScore(match_phase: string): boolean {
        const arr = ["-", "1H", "HT", "2H", "FT"];
        console.warn("isShowFullScore: ", arr.includes(match_phase));
        return arr.includes(match_phase);
    }
    /**是否显示点球比分 */
    isShowPK(match_phase: string): boolean {
        const arr = ["PK", "PK FT"];
        return arr.includes(match_phase);
    }

    //模板分类
    marketTypeKind = {
        1: ["MATCH_ODDS", "MATCH_ODDS_HALF_TIME"],
        2: [
            "TOTAL_GOALS",
            "ASIAN_OVER_UNDER",
            "ASIAN_OVER_UNDER_HALF_TIME",
            "TOTAL_GOALS_HALF_TIME",
            "BOTH_TEAMS_TO_SCORE",
            "TEAM_A_WIN_TO_NIL",
            "TEAM_B_WIN_TO_NIL",
            "ODD_OR_EVEN",
            "TEAM_A_WIN_TO_NIL_HALF_TIME",
            "TEAM_B_WIN_TO_NIL_HALF_TIME",
            "BOTH_TEAMS_TO_SCORE_HALF_TIME",
            "ODD_OR_EVEN_HALF_TIME",
            "OVER_UNDER",
            "CR_ASIAN_OVER_UNDER",
            "ASIAN_OVER_UNDER_EXTRA_TIME",
            "ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME",
            "ASIAN_OVER_UNDER_AFTER_PENALTIES",
        ],
        3: ["DRAW_NO_BET", "DRAW_NO_BET_HALF_TIME"],
        4: ["HALF_TIME_FULL_TIME"],
        5: ["CORRECT_SCORE", "CORRECT_SCORE_HALF_TIME"],
        6: [
            "HANDICAP",
            "ASIAN_HANDICAP",
            "ASIAN_HANDICAP_HALF_TIME",
            "CR_ASIAN_HANDICAP",
            "ASIAN_HANDICAP_EXTRA_TIME",
            "ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME",
            "ASIAN_HANDICAP_AFTER_PENALTIES",
        ],
        7: ["DOUBLE_CHANCE", "DOUBLE_CHANCE_HALF_TIME"],
    };

    onType(type: string) {
        GlobalVar.loading = true;
        this.pageData.isNeedOpenAll = true;
        this.myProxy.listQueryMarket.type = type;
        this.myProxy.api_market_typelist();
    }

    onMarketType(market_type: number) {
        this.pageData.showMarket = false;
        GlobalVar.loading = true;
        this.pageData.isOpenAll = true;
        this.pageData.isNeedOpenAll = true;
        this.myProxy.listQueryMarket.market_type = market_type;
        this.myProxy.api_market_typelist();
    }

    onQuery() {
        this.pageData.isNeedOpenAll = true;
        this.myProxy.api_market_typelist();
    }

    onOpenOrders() {
        // page_orders.show();
    }

    //返回
    onBack() {
        this.$router.replace("/page_lobby");
        // this.facade.removeProxy(PageMatcheProxy.NAME);
    }

    /**打开/关闭 所有 */
    onOpenAll() {
        this.pageData.isOpenAll = !this.pageData.isOpenAll;
        if (this.pageData.isOpenAll) {
            this.pageData.panelIndexs = [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
            ];
        } else {
            this.pageData.panelIndexs = [];
        }
    }

    // destroyed() {
    //     super.destroyed();
    //     const divScroll: any = this.$refs.divScroll;
    //     if (divScroll) {
    //         divScroll.removeEventListener("scroll", this.scrollHandle, true);
    //     }
    // }

    onScroll(e: any) {
        this.offsetTop = e.target.scrollTop;
    }

    showHelp() {
        // page_help.show();
    }

    goMatche(event_id: number) {
        // page_matche.show(event_id);
    }

    showOtherCompetition(){
        this.myProxy.api_event_competition_list();
    }

    destroyed() {
        super.destroyed();
    }
}

// 0: {id: 231, market_type: 'OVER_UNDER', parent_id: 0, title: '大/小球', title_new: '大/小球'}
// 1: {id: 74, market_type: 'HANDICAP', parent_id: 0, title: '让球', title_new: '让球'}
// 2: {id: 1, market_type: 'MATCH_ODDS', parent_id: 0, title: '主客和', title_new: '主客和'}
// 3: {id: 3, market_type: 'ASIAN_HANDICAP', parent_id: 74, title: '亚洲让球盘', title_new: '亚洲让球盘'}
// 4: {id: 258, market_type: 'ASIAN_OVER_UNDER', parent_id: 231, title: '亚洲大小盘', title_new: '亚洲大小盘'}
// 5: {id: 230, market_type: 'TOTAL_GOALS', parent_id: 231, title: '总入球', title_new: '总入球'}
// 6: {id: 274, market_type: 'CR_ASIAN_OVER_UNDER', parent_id: 0, title: '亚洲大小盘 - 角球', title_new: '亚洲大小盘 - 角球'}
// 7: {id: 273, market_type: 'CR_ASIAN_HANDICAP', parent_id: 0, title: '亚洲让球盘 - 角球', title_new: '亚洲让球盘 - 角球'}
// 8: {id: 13, market_type: 'DRAW_NO_BET', parent_id: 1, title: '平局退款', title_new: '平局退款'}
// 9: {id: 4, market_type: 'BOTH_TEAMS_TO_SCORE', parent_id: 0, title: '两队都得分', title_new: '两队都得分'}
// 10: {id: 251, market_type: 'MATCH_ODDS_HALF_TIME', parent_id: 1, title: '半场 - 主客和', title_new: '半场 - 主客和'}
// 11: {id: 22, market_type: 'HALF_TIME_FULL_TIME', parent_id: 1, title: '半场/全场', title_new: '半场/全场'}
// 12: {id: 21, market_type: 'CORRECT_SCORE', parent_id: 1, title: '波胆', title_new: '波胆'}
// 13: {id: 14, market_type: 'DOUBLE_CHANCE', parent_id: 0, title: '双重机会/双胜彩', title_new: '双重机会/双胜彩'}
// 14: {id: 28, market_type: 'TEAM_A_WIN_TO_NIL', parent_id: 0, title: '主队零失球获胜', title_new: '主队零失球获胜'}
// 15: {id: 26, market_type: 'TEAM_B_WIN_TO_NIL', parent_id: 0, title: '客队零失球获胜', title_new: '客队零失球获胜'}
// 16: {id: 27, market_type: 'ODD_OR_EVEN', parent_id: 231, title: '入球单双', title_new: '入球单双'}
// 17: {id: 246, market_type: 'ASIAN_HANDICAP_HALF_TIME', parent_id: 74, title: '半场 - 亚洲让球盘', title_new: '半场 - 亚洲让球盘'}
// 18: {id: 257, market_type: 'DRAW_NO_BET_HALF_TIME', parent_id: 1, title: '半场-平局退款', title_new: '半场-平局退款'}
// 19: {id: 248, market_type: 'ASIAN_OVER_UNDER_HALF_TIME', parent_id: 231, title: '半场 - 亚洲大小盘', title_new: '半场 - 亚洲大小盘'}
// 20: {id: 259, market_type: 'TOTAL_GOALS_HALF_TIME', parent_id: 231, title: '半场 - 总入球', title_new: '半场 - 总入球'}
// 21: {id: 256, market_type: 'DOUBLE_CHANCE_HALF_TIME', parent_id: 0, title: '半场 - 双重机会/双胜彩', title_new: '半场 - 双重机会/双胜彩'}
// 22: {id: 252, market_type: 'TEAM_A_WIN_TO_NIL_HALF_TIME', parent_id: 0, title: '半场 - 主队零失球获胜', title_new: '半场 - 主队零失球获胜'}
// 23: {id: 255, market_type: 'TEAM_B_WIN_TO_NIL_HALF_TIME', parent_id: 0, title: '半场 - 客队零失球获胜', title_new: '半场 - 客队零失球获胜'}
// 24: {id: 253, market_type: 'BOTH_TEAMS_TO_SCORE_HALF_TIME', parent_id: 0, title: '半场 - 两队都得分', title_new: '半场 - 两队都得分'}
// 25: {id: 250, market_type: 'ODD_OR_EVEN_HALF_TIME', parent_id: 231, title: '半场 - 单/双 ', title_new: '半场 - 单/双 '}
// 26: {id: 254, market_type: 'CORRECT_SCORE_HALF_TIME', parent_id: 1, title: '半场 - 波胆', title_new: '半场 - 波胆'}
// 27: {id: 261, market_type: 'ASIAN_HANDICAP_EXTRA_TIME', parent_id: 74, title: '亚洲让球盘 超时', title_new: '亚洲让球盘 超时'}
// 28: {id: 263, market_type: 'ASIAN_OVER_UNDER_EXTRA_TIME', parent_id: 231, title: '亚洲大小球-  超時- 半場 ', title_new: '亚洲大小球-  超時- 半場 '}
// 29: {id: 262, market_type: 'ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME', parent_id: 0, title: '亚洲让球盘 超时- 半场 ', title_new: '亚洲让球盘 超时- 半场 '}
// 30: {id: 249, market_type: 'ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME', parent_id: 231, title: '亚洲大小盘- 半场加时赛', title_new: '亚洲大小盘- 半场加时赛'}
// 31: {id: 260, market_type: 'ASIAN_HANDICAP_AFTER_PENALTIES', parent_id: 74, title: '亚洲让球盘 - 点球对决后', title_new: '亚洲让球盘 - 点球对决后'}
// 32: {id: 247, market_type: 'ASIAN_OVER_UNDER_AFTER_PENALTIES', parent_id: 231, title: '亚洲大小盘－罚球', title_new: '亚洲大小盘－罚球'}
// 33: {id: 286, market_type: 'RMM_OUTRIGHTS', parent_id: 0, title: '冠军', title_new: '冠军'}