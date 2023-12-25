import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import MatcheMediator from "../mediator/MatcheMediator";
import MatcheProxy from "../proxy/MatcheProxy";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import RightPanelProxy from "../../right_panel/proxy/RightPanelProxy";

@Component
export default class Matche extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    rightProxy: RightPanelProxy = this.getProxy(RightPanelProxy);
    myProxy: MatcheProxy = this.getProxy(MatcheProxy);
    pageData = this.myProxy.pageData;
    timer = 0;

    constructor() {
        super(MatcheMediator);
    }

    mounted() {
        if (!this.$vuetify.breakpoint.mobile) {
            this.timer = setInterval(this.resizeListHeight.bind(this), 1000);
        }
    }

    resizeListHeight() {
        const divlist = this.$refs.divlist;
        if (divlist) {
            //@ts-ignore
            const el: HTMLElement = divlist.$el;
            if (el) el.style.height = document.body.clientHeight - el.getBoundingClientRect().top + "px";
        }
    }

    @Watch("$router.currentRoute.query")
    onWatchId() {
        this.myProxy.onRegister();
    }

    get matche() {
        return this.pageData.competition_list[0]?.matches[0];
    }

    /**盘口 筛选 */
    get market_main_type() {
        const arr = [{ id: 0, name: LangUtil("所有") }];
        arr.push(...this.pageData.marketTypeOptions.market_main_type);
        return arr;
    }

    transTitle(title: any) {
        const homestr = LangUtil("主队").trim();
        const awaystr = LangUtil("客队").trim();
        const { home_team, away_team } = this.matche;
        title = title.replace(new RegExp(homestr, "ig"), home_team).replace(new RegExp(awaystr, "ig"), away_team);
        return title;
    }

    get marketSort() {
        const markets = this.pageData.market_list[0].fix_markets;
        let keys = Object.keys(markets).sort((a, b) => markets[a].sort - markets[b].sort);
        const arr = [];
        for (const key of keys) {
            arr.push(markets[key]);
        }
        return arr;
    }

    //模板分类
    marketTypeKind = {
        1: [
            "MATCH_ODDS",
            "MATCH_ODDS_HALF_TIME",
            "3_WAY_HANDICAP_MINUS_4",
            "3_WAY_HANDICAP_MINUS_3",
            "3_WAY_HANDICAP_MINUS_2",
            "3_WAY_HANDICAP_MINUS_1",
            "3_WAY_HANDICAP_PLUS_1",
            "3_WAY_HANDICAP_PLUS_2",
            "3_WAY_HANDICAP_PLUS_3",
            "3_WAY_HANDICAP_PLUS_4",
            "3_WAY_HANDICAP_MINUS_4_HALF_TIME",
            "3_WAY_HANDICAP_MINUS_3_HALF_TIME",
            "3_WAY_HANDICAP_MINUS_2_HALF_TIME",
            "3_WAY_HANDICAP_MINUS_1_HALF_TIME",
            "3_WAY_HANDICAP_PLUS_1_HALF_TIME",
            "3_WAY_HANDICAP_PLUS_2_HALF_TIME",
            "3_WAY_HANDICAP_PLUS_3_HALF_TIME",
            "3_WAY_HANDICAP_PLUS_4_HALF_TIME",

            "MONEY_LINE",
            "MONEY_LINE_FIRST_QUARTER",
            "MONEY_LINE_HALF_TIME",
        ],
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
            "CR_ASIAN_OVER_UNDER_HALF_TIME",
            "ASIAN_OVER_UNDER_EXTRA_TIME",
            "ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME",
            "ASIAN_OVER_UNDER_AFTER_PENALTIES",
            "EITHER_TEAM_TO_SCORE",
            "EITHER_TEAM_TO_SCORE_HALF_TIME",

            "EITHER_TEAM_TO_SCORE_TWICE_OR_MORE",
            "EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
            "TEAM_A_TO_SCORE",
            "TEAM_A_TO_SCORE_HALF_TIME",
            "TEAM_B_TO_SCORE",
            "TEAM_B_TO_SCORE_HALF_TIME",

            "TEAM_A_TO_SCORE_TWICE_OR_MORE",
            "TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
            "TEAM_B_TO_SCORE_TWICE_OR_MORE",
            "TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
            "BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE",
            "BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME",

            "TEAM_A_GOALS_ODD_OR_EVEN",
            "TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME",
            "TEAM_B_GOALS_ODD_OR_EVEN",
            "TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME",
            "EITHER_TEAM_TO_SCORE_THREE_OR_MORE",
            "EITHER_TEAM_TO_SCORE_THREE_OR_MORE_HALF_TIME",
            "BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE",
            "BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
            "BK_ASIAN_OVER_UNDER",
            "BK_ASIAN_OVER_UNDER_HALF_TIME",

            "TOTAL_POINTS",
            "TOTAL_POINTS_FIRST_QUARTER",
            "TOTAL_POINTS_HALF_TIME",
        ],
        3: ["DRAW_NO_BET", "DRAW_NO_BET_HALF_TIME"],
        4: [
            "HALF_TIME_FULL_TIME",
            "WINNING_MARGIN",
            "WINNING_MARGIN_HALF_TIME",
            "TOTAL_GOALS_RANGE",
            "TOTAL_GOALS_RANGE_HALF_TIME",
            "TEAM_A_EXACT_GOALS",
            "TEAM_A_EXACT_GOALS_HALF_TIME",
            "TEAM_B_EXACT_GOALS",
            "TEAM_B_EXACT_GOALS_HALF_TIME",
            "MATCH_ODDS_AND_OVER_UNDER_2.5",
            "MATCH_ODDS_AND_OVER_UNDER_2.5_HALF_TIME",
            "ODD_OR_EVEN_AND_OVER_UNDER_2.5",
            "ODD_OR_EVEN_AND_OVER_UNDER_2.5_HALF_TIME",
            "MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE",
            "MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE_HALF_TIME",
            "BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2.5",
            "BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2.5_HALF_TIME",

            "TEAM_A_TOTAL_POINTS",
            "TEAM_A_TOTAL_POINTS_FIRST_QUARTER",
            "TEAM_A_TOTAL_POINTS_HALF_TIME",

            "TEAM_B_TOTAL_POINTS",
            "TEAM_B_TOTAL_POINTS_FIRST_QUARTER",
            "TEAM_B_TOTAL_POINTS_HALF_TIME",
        ],
        5: ["CORRECT_SCORE", "CORRECT_SCORE_HALF_TIME"],
        6: [
            "HANDICAP",
            "ASIAN_HANDICAP",
            "ASIAN_HANDICAP_HALF_TIME",
            "CR_ASIAN_HANDICAP",
            "CR_ASIAN_HANDICAP_HALF_TIME",
            "ASIAN_HANDICAP_EXTRA_TIME",
            "ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME",
            "ASIAN_HANDICAP_AFTER_PENALTIES",
            "BK_ASIAN_HANDICAP",
            "BK_ASIAN_HANDICAP_HALF_TIME",

            "HANDICAP_FIRST_QUARTER",
            "HANDICAP_HALF_TIME",
        ],
        7: ["DOUBLE_CHANCE", "DOUBLE_CHANCE_HALF_TIME"],
        8: [
            "3_WAY_OVER_UNDER_1",
            "3_WAY_OVER_UNDER_1_HALF_TIME",
            "3_WAY_OVER_UNDER_2",
            "3_WAY_OVER_UNDER_2_HALF_TIME",
            "3_WAY_OVER_UNDER_3",
            "3_WAY_OVER_UNDER_3_HALF_TIME",
            "3_WAY_OVER_UNDER_4",
            "3_WAY_OVER_UNDER_4_HALF_TIME",
            "3_WAY_OVER_UNDER_5",
            "3_WAY_OVER_UNDER_5_HALF_TIME",
            "3_WAY_OVER_UNDER_6",
            "3_WAY_OVER_UNDER_6_HALF_TIME",
            "3_WAY_OVER_UNDER_7",
            "3_WAY_OVER_UNDER_7_HALF_TIME",
            "3_WAY_OVER_UNDER_8",
            "3_WAY_OVER_UNDER_8_HALF_TIME",
        ],
    };

    onMarketType(market_type: number) {
        this.pageData.loading = true;
        this.pageData.isOpenAll = true;
        this.pageData.isNeedOpenAll = true;
        this.myProxy.listQueryMarket.market_type = market_type;
        this.myProxy.api_market_typelist();
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

    onTipsClick(attrs: any) {
        if (attrs["aria-expanded"] == "true") attrs["aria-expanded"] = "false";
    }

    destroyed() {
        clearInterval(this.timer);
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
// 33: {id: 296, market_type: 'EITHER_TEAM_TO_SCORE', parent_id: 0, title: '任意一队得分', title_new: '任意一队得分'}
// 33: {id: 297, market_type: 'EITHER_TEAM_TO_SCORE_HALF_TIME', parent_id: 0, title: '半场 - 任意一队得分', title_new: '半场 - 任意一队得分'}
// 38: {id: 297, market_type: 'EITHER_TEAM_TO_SCORE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 任意一队得分', …}
// 39: {id: 299, market_type: 'EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 任意一队得分两次或以上', …}

// 0
// :
// {id: 1, market_type: 'MATCH_ODDS', parent_id: 0, main_type: '17,23,32', title: '主客和', …}
// 1
// :
// {id: 3, market_type: 'ASIAN_HANDICAP', parent_id: 74, main_type: '17,20,23', title: '亚洲让球盘', …}
// 2
// :
// {id: 258, market_type: 'ASIAN_OVER_UNDER', parent_id: 231, main_type: '17,21,23', title: '亚洲大小盘', …}
// 3
// :
// {id: 13, market_type: 'DRAW_NO_BET', parent_id: 1, main_type: '23,32', title: '平局退款', …}
// 4
// :
// {id: 230, market_type: 'TOTAL_GOALS', parent_id: 231, main_type: '21,23', title: '总入球', …}
// 5
// :
// {id: 273, market_type: 'CR_ASIAN_HANDICAP', parent_id: 0, main_type: '23,25', title: '亚洲让球盘 - 角球', …}
// 6
// :
// {id: 274, market_type: 'CR_ASIAN_OVER_UNDER', parent_id: 0, main_type: '23,25', title: '亚洲大小盘 - 角球', …}
// 7
// :
// {id: 21, market_type: 'CORRECT_SCORE', parent_id: 1, main_type: '22,23', title: '波胆', …}
// 8
// :
// {id: 22, market_type: 'HALF_TIME_FULL_TIME', parent_id: 1, main_type: '23,32', title: '半场/全场', …}
// 9
// :
// {id: 14, market_type: 'DOUBLE_CHANCE', parent_id: 0, main_type: '23,32', title: '双重机会/双胜彩', …}
// 10
// :
// {id: 28, market_type: 'TEAM_A_WIN_TO_NIL', parent_id: 0, main_type: '23,29', title: '主队零失球获胜', …}
// 11
// :
// {id: 26, market_type: 'TEAM_B_WIN_TO_NIL', parent_id: 0, main_type: '23,29', title: '客队零失球获胜', …}
// 12
// :
// {id: 300, market_type: 'TEAM_A_TO_SCORE', parent_id: 0, main_type: '23,32', title: '主队得分', …}
// 13
// :
// {id: 302, market_type: 'TEAM_B_TO_SCORE', parent_id: 0, main_type: '23,32', title: '客队得分', …}
// 14
// :
// {id: 308, market_type: 'TEAM_A_TO_SCORE_TWICE_OR_MORE', parent_id: 0, main_type: '23,32', title: '主队得分两次或以上', …}
// 15
// :
// {id: 310, market_type: 'TEAM_B_TO_SCORE_TWICE_OR_MORE', parent_id: 0, main_type: '23,32', title: '客队得分两次或以上', …}
// 16
// :
// {id: 4, market_type: 'BOTH_TEAMS_TO_SCORE', parent_id: 0, main_type: '23,32', title: '两队都得分', …}
// 17
// :
// {id: 312, market_type: 'BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE', parent_id: 0, main_type: '23,32', title: '两队都得分兩次或以上', …}
// 18
// :
// {id: 296, market_type: 'EITHER_TEAM_TO_SCORE', parent_id: 0, main_type: '23,32', title: '任意一队得分', …}
// 19
// :
// {id: 298, market_type: 'EITHER_TEAM_TO_SCORE_TWICE_OR_MORE', parent_id: 0, main_type: '23,32', title: '任意一队得两分或以上', …}
// 20
// :
// {id: 27, market_type: 'ODD_OR_EVEN', parent_id: 231, main_type: '21,23', title: '入球单双', …}
// 21
// :
// {id: 304, market_type: 'TEAM_A_GOALS_ODD_OR_EVEN', parent_id: 0, main_type: '21,23', title: '主队得分单/双', …}
// 22
// :
// {id: 306, market_type: 'TEAM_B_GOALS_ODD_OR_EVEN', parent_id: 0, main_type: '21,23', title: '客队得分单/双', …}
// 23
// :
// {id: 251, market_type: 'MATCH_ODDS_HALF_TIME', parent_id: 1, main_type: '24,32', title: '半场 - 主客和', …}
// 24
// :
// {id: 246, market_type: 'ASIAN_HANDICAP_HALF_TIME', parent_id: 74, main_type: '20,24', title: '半场 - 亚洲让球盘', …}
// 25
// :
// {id: 248, market_type: 'ASIAN_OVER_UNDER_HALF_TIME', parent_id: 231, main_type: '21,24', title: '半场 - 亚洲大小盘', …}
// 26
// :
// {id: 257, market_type: 'DRAW_NO_BET_HALF_TIME', parent_id: 1, main_type: '24,32', title: '半场-平局退款', …}
// 27
// :
// {id: 259, market_type: 'TOTAL_GOALS_HALF_TIME', parent_id: 231, main_type: '21,24', title: '半场 - 总入球', …}
// 28
// :
// {id: 254, market_type: 'CORRECT_SCORE_HALF_TIME', parent_id: 1, main_type: '22,24', title: '半场 - 波胆', …}
// 29
// :
// {id: 256, market_type: 'DOUBLE_CHANCE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 双重机会/双胜彩', …}
// 30
// :
// {id: 252, market_type: 'TEAM_A_WIN_TO_NIL_HALF_TIME', parent_id: 0, main_type: '24,29', title: '半场 - 主队零失球获胜', …}
// 31
// :
// {id: 255, market_type: 'TEAM_B_WIN_TO_NIL_HALF_TIME', parent_id: 0, main_type: '24,29', title: '半场 - 客队零失球获胜', …}
// 32
// :
// {id: 301, market_type: 'TEAM_A_TO_SCORE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 主队得分', …}
// 33
// :
// {id: 303, market_type: 'TEAM_B_TO_SCORE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 客队得分', …}
// 34
// :
// {id: 309, market_type: 'TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 主队得分两次或以上', …}
// 35
// :
// {id: 311, market_type: 'TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 客队得分两次或以上', …}
// 36
// :
// {id: 253, market_type: 'BOTH_TEAMS_TO_SCORE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 两队都得分', …}
// 37
// :
// {id: 313, market_type: 'BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 两队都得分两次或以上', …}
// 38
// :
// {id: 297, market_type: 'EITHER_TEAM_TO_SCORE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 任意一队得分', …}
// 39
// :
// {id: 299, market_type: 'EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME', parent_id: 0, main_type: '24,32', title: '半场 - 任意一队得分两次或以上', …}
// 40
// :
// {id: 250, market_type: 'ODD_OR_EVEN_HALF_TIME', parent_id: 231, main_type: '21,24', title: '半场 - 单/双 ', …}
// 41
// :
// {id: 261, market_type: 'ASIAN_HANDICAP_EXTRA_TIME', parent_id: 74, main_type: '20', title: '亚洲让球盘 超时', …}
// 42
// :
// {id: 262, market_type: 'ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME', parent_id: 0, main_type: '20', title: '半场-亚洲让球盘 超时 ', …}
// 43
// :
// {id: 263, market_type: 'ASIAN_OVER_UNDER_EXTRA_TIME', parent_id: 231, main_type: '21', title: '亚洲大小球 超時', …}
// 44
// :
// {id: 305, market_type: 'TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME', parent_id: 0, main_type: '21,24', title: '半场 - 主队得分单/双', …}
// 45
// :
// {id: 307, market_type: 'TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME', parent_id: 0, main_type: '21,24', title: '半场 - 客队得分单/双', …}
// 46
// :
// {id: 247, market_type: 'ASIAN_OVER_UNDER_AFTER_PENALTIES', parent_id: 231, main_type: '21', title: '亚洲大小盘－罚球点球', …}
// 47
// :
// {id: 249, market_type: 'ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME', parent_id: 231, main_type: '21', title: '半场-亚洲大小盘 超时', …}
// 48
// :
// {id: 260, market_type: 'ASIAN_HANDICAP_AFTER_PENALTIES', parent_id: 74, main_type: '20', title: '亚洲让球盘-点球对决后', …}
