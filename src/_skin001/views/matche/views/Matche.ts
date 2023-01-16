import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import MatcheMediator from "../mediator/MatcheMediator";
import MatcheProxy from "../proxy/MatcheProxy";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";

@Component
export default class Matche extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    myProxy: MatcheProxy = this.getProxy(MatcheProxy);
    pageData = this.myProxy.pageData;

    //分类按扭列表，拖动参数
    dragData = {
        isMoving: false,
        x: 0,
        left: 0,
    };

    constructor() {
        super(MatcheMediator);
    }

    onMouseDown(event: any) {
        this.dragData.isMoving = true;
        this.dragData.x = event.pageX;
        //@ts-ignore
        const boxType: HTMLElement = this.$refs.boxType?.$el;
        this.dragData.left = boxType.scrollLeft;
    }
    onMouseUp(event: any) {
        var distanceX = event.pageX - this.dragData.x;
        if (Math.abs(distanceX) > 0) {
            setTimeout(() => {
                this.dragData.isMoving = false;
            }, 100);
        } else {
            this.dragData.isMoving = false;
        }
    }
    onMouseMove(event: any) {
        if (this.dragData.isMoving) {
            //@ts-ignore
            const boxType: HTMLElement = this.$refs.boxType?.$el;
            var distanceX = event.pageX - this.dragData.x;
            boxType.scrollLeft = this.dragData.left - distanceX;
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
    get marketTypeOptions() {
        return this.myProxy.marketTypeOptions;
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

    onMarketType(market_type: number) {
        if (!this.dragData.isMoving) {
            GlobalVar.loading = true;
            this.pageData.isOpenAll = true;
            this.pageData.isNeedOpenAll = true;
            this.myProxy.listQueryMarket.market_type = market_type;
            this.myProxy.api_market_typelist();
        }
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
