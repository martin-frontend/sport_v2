import { FixSelectionVO } from "@/vo/MarketVO";
import { MatchVO } from "@/vo/MatchVO";
import LangUtil from "./LangUtil";

const EnumMarketType = {
    MATCH_ODDS: "MATCH_ODDS",
    TOTAL_GOALS: "TOTAL_GOALS",
    ASIAN_HANDICAP: "ASIAN_HANDICAP",
    ASIAN_OVER_UNDER: "ASIAN_OVER_UNDER",
    DRAW_NO_BET: "DRAW_NO_BET",
    BOTH_TEAMS_TO_SCORE: "BOTH_TEAMS_TO_SCORE",
    MATCH_ODDS_HALF_TIME: "MATCH_ODDS_HALF_TIME",
    HALF_TIME_FULL_TIME: "HALF_TIME_FULL_TIME",
    CORRECT_SCORE: "CORRECT_SCORE",
    DOUBLE_CHANCE: "DOUBLE_CHANCE",
    TEAM_A_WIN_TO_NIL: "TEAM_A_WIN_TO_NIL",
    TEAM_B_WIN_TO_NIL: "TEAM_B_WIN_TO_NIL",
    ODD_OR_EVEN: "ODD_OR_EVEN",
    ASIAN_HANDICAP_HALF_TIME: "ASIAN_HANDICAP_HALF_TIME",
    DRAW_NO_BET_HALF_TIME: "DRAW_NO_BET_HALF_TIME",
    ASIAN_OVER_UNDER_HALF_TIME: "ASIAN_OVER_UNDER_HALF_TIME",
    TOTAL_GOALS_HALF_TIME: "TOTAL_GOALS_HALF_TIME",
    DOUBLE_CHANCE_HALF_TIME: "DOUBLE_CHANCE_HALF_TIME",
    TEAM_A_WIN_TO_NIL_HALF_TIME: "TEAM_A_WIN_TO_NIL_HALF_TIME",
    TEAM_B_WIN_TO_NIL_HALF_TIME: "TEAM_B_WIN_TO_NIL_HALF_TIME",
    BOTH_TEAMS_TO_SCORE_HALF_TIME: "BOTH_TEAMS_TO_SCORE_HALF_TIME",
    ODD_OR_EVEN_HALF_TIME: "ODD_OR_EVEN_HALF_TIME",
    CORRECT_SCORE_HALF_TIME: "CORRECT_SCORE_HALF_TIME",
    HANDICAP: "HANDICAP",
    OVER_UNDER: "OVER_UNDER",
    CR_ASIAN_HANDICAP: "CR_ASIAN_HANDICAP",
    CR_ASIAN_OVER_UNDER: "CR_ASIAN_OVER_UNDER",
    RMM_OUTRIGHT: "RMM_OUTRIGHT",
    RMM_GROUP_A_WINNER: "RMM_GROUP_A_WINNER",
    RMM_GROUP_B_WINNER: "RMM_GROUP_B_WINNER",
    ASIAN_HANDICAP_EXTRA_TIME: "ASIAN_HANDICAP_EXTRA_TIME",
    ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME: "ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME",
    ASIAN_HANDICAP_AFTER_PENALTIES: "ASIAN_HANDICAP_AFTER_PENALTIES",
    ASIAN_OVER_UNDER_EXTRA_TIME: "ASIAN_OVER_UNDER_EXTRA_TIME",
    ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME: "ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME",
    ASIAN_OVER_UNDER_AFTER_PENALTIES: "ASIAN_OVER_UNDER_AFTER_PENALTIES",
};

function formatAsian(handicap: string, type: string): string {
    if (handicap && type) {
        let value = parseFloat(handicap);
        const symbol: any = value > 0 ? "+" : value == 0 ? "" : "-";
        value = Math.abs(value);
        if (value % 0.5 == 0) {
            return value != 0 ? symbol + value : value;
        }
        const min = Math.floor(value / 0.5);
        const max = Math.ceil(value / 0.5);
        return `${symbol}${min * 0.5}/${max * 0.5}`;
    } else {
        return "";
    }
}

/**为URL附加参数 */
function getSelectionName(market_type: string, selection: FixSelectionVO, matche?: MatchVO, noBet: boolean = true): string {
    switch (market_type) {
        case EnumMarketType.ASIAN_HANDICAP:
        case EnumMarketType.ASIAN_HANDICAP_HALF_TIME:
        case EnumMarketType.CR_ASIAN_HANDICAP:
        case EnumMarketType.ASIAN_HANDICAP_EXTRA_TIME:
        case EnumMarketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME:
        case EnumMarketType.ASIAN_HANDICAP_AFTER_PENALTIES:
            return formatAsian(selection.handicap, selection.type);
        case EnumMarketType.ASIAN_OVER_UNDER:
        case EnumMarketType.ASIAN_OVER_UNDER_HALF_TIME:
        case EnumMarketType.CR_ASIAN_OVER_UNDER:
        case EnumMarketType.ASIAN_OVER_UNDER_EXTRA_TIME:
        case EnumMarketType.ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME:
        case EnumMarketType.ASIAN_OVER_UNDER_AFTER_PENALTIES:
            return (selection.type == "Overs" ? LangUtil("大") : LangUtil("小")) + " " + formatAsian(selection.handicap, selection.type).substring(1);
        case EnumMarketType.MATCH_ODDS:
        case EnumMarketType.MATCH_ODDS_HALF_TIME:
            return "";
        case EnumMarketType.TOTAL_GOALS:
        case EnumMarketType.TOTAL_GOALS_HALF_TIME:
            return (selection.type == "Overs" ? LangUtil("大") : LangUtil("小")) + " " + formatAsian(selection.handicap, selection.type).substring(1);
        case EnumMarketType.ODD_OR_EVEN_HALF_TIME:
        case EnumMarketType.ODD_OR_EVEN:
            return selection.type == "Odd" ? LangUtil("单") : LangUtil("双");
        case EnumMarketType.TEAM_A_WIN_TO_NIL:
        case EnumMarketType.TEAM_B_WIN_TO_NIL:
        case EnumMarketType.TEAM_A_WIN_TO_NIL_HALF_TIME:
        case EnumMarketType.TEAM_B_WIN_TO_NIL_HALF_TIME:
        case EnumMarketType.BOTH_TEAMS_TO_SCORE:
        case EnumMarketType.BOTH_TEAMS_TO_SCORE_HALF_TIME:
            return selection.type == "Yes" ? LangUtil("是") : LangUtil("否");
        case EnumMarketType.DRAW_NO_BET:
        case EnumMarketType.DRAW_NO_BET_HALF_TIME:
            //@ts-ignore
            return selection.type == "Home" ? matche.home_team : matche.away_team;
        case EnumMarketType.CORRECT_SCORE:
        case EnumMarketType.CORRECT_SCORE_HALF_TIME:
            return selection.type == "" ? LangUtil("其它") : selection.type;
    }
    if (selection.type == "Home-Draw" && noBet) return `${LangUtil("主")}-${LangUtil("和")}`;
    if (selection.type == "Away-Draw" && noBet) return `${LangUtil("客")}-${LangUtil("和")}`;
    if (selection.type == "Home-Home" && noBet) return `${LangUtil("主")}-${LangUtil("主")}`;
    if (selection.type == "Home-Away" && noBet) return `${LangUtil("主")}-${LangUtil("客")}`;
    if (selection.type == "Away-Away" && noBet) return `${LangUtil("客")}-${LangUtil("客")}`;
    if (selection.type == "Away-Home" && noBet) return `${LangUtil("客")}-${LangUtil("主")}`;
    if (selection.type == "Draw-Home" && noBet) return `${LangUtil("和")}-${LangUtil("主")}`;
    if (selection.type == "Draw-Draw" && noBet) return `${LangUtil("和")}-${LangUtil("和")}`;
    if (selection.type == "Draw-Away" && noBet) return `${LangUtil("和")}-${LangUtil("客")}`;
    return noBet == true ? selection.type : "";
}

const MarketUtils = {
    EnumMarketType,
    formatAsian,
    getSelectionName,
};

export default MarketUtils;

// 0: {id: 1, market_type: 'MATCH_ODDS', title: '主客和'}
// 1: {id: 230, market_type: 'TOTAL_GOALS', title: '总入球'}
// 2: {id: 3, market_type: 'ASIAN_HANDICAP', title: '亚洲让球盘'}
// 3: {id: 258, market_type: 'ASIAN_OVER_UNDER', title: '亚洲大小盘'}
// 4: {id: 13, market_type: 'DRAW_NO_BET', title: '平局退款'}
// 5: {id: 4, market_type: 'BOTH_TEAMS_TO_SCORE', title: '两队都得分'}
// 6: {id: 251, market_type: 'MATCH_ODDS_HALF_TIME', title: '半场 - 主客和'}
// 7: {id: 22, market_type: 'HALF_TIME_FULL_TIME', title: '半场/全场'}
// 8: {id: 21, market_type: 'CORRECT_SCORE', title: '波胆'}
// 9: {id: 14, market_type: 'DOUBLE_CHANCE', title: '双重机会/双胜彩'}
// 10: {id: 28, market_type: 'TEAM_A_WIN_TO_NIL', title: '主队零失球获胜'}
// 11: {id: 26, market_type: 'TEAM_B_WIN_TO_NIL', title: '客队零失球获胜'}
// 12: {id: 27, market_type: 'ODD_OR_EVEN', title: '入球单双'}
// 13: {id: 246, market_type: 'ASIAN_HANDICAP_HALF_TIME', title: '半场 - 亚洲让球盘'}
// 14: {id: 257, market_type: 'DRAW_NO_BET_HALF_TIME', title: '半场-平局退款'}
// 15: {id: 248, market_type: 'ASIAN_OVER_UNDER_HALF_TIME', title: '半场 - 亚洲大小盘'}
// 16: {id: 259, market_type: 'TOTAL_GOALS_HALF_TIME', title: '半场 - 总入球'}
// 17: {id: 256, market_type: 'DOUBLE_CHANCE_HALF_TIME', title: '半场 - 双重机会/双胜彩'}
// 18: {id: 252, market_type: 'TEAM_A_WIN_TO_NIL_HALF_TIME', title: '半场 - 主队零失球获胜'}
// 19: {id: 255, market_type: 'TEAM_B_WIN_TO_NIL_HALF_TIME', title: '半场 - 客队零失球获胜'}
// 20: {id: 253, market_type: 'BOTH_TEAMS_TO_SCORE_HALF_TIME', title: '半场 - 两队都得分'}
// 21: {id: 250, market_type: 'ODD_OR_EVEN_HALF_TIME', title: '半场 - 单/双 '}
// 22: {id: 254, market_type: 'CORRECT_SCORE_HALF_TIME', title: '半场 - 波胆'}
// 23: {id: 74, market_type: 'HANDICAP', title: '让球'}
// 24: {id: 231, market_type: 'OVER_UNDER', title: '大/小球'}
// 25: {id: 250, market_type: 'ODD_OR_EVEN_HALF_TIME', parent_id: 231, title: '半场 - 单/双 ', title_new: '半场 - 单/双 '}
// 26: {id: 254, market_type: 'CORRECT_SCORE_HALF_TIME', parent_id: 1, title: '半场 - 波胆', title_new: '半场 - 波胆'}
// 27: {id: 261, market_type: 'ASIAN_HANDICAP_EXTRA_TIME', parent_id: 74, title: '亚洲让球盘 超时', title_new: '亚洲让球盘 超时'}
// 28: {id: 263, market_type: 'ASIAN_OVER_UNDER_EXTRA_TIME', parent_id: 231, title: '亚洲大小球-  超時- 半場 ', title_new: '亚洲大小球-  超時- 半場 '}
// 29: {id: 262, market_type: 'ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME', parent_id: 0, title: '亚洲让球盘 超时- 半场 ', title_new: '亚洲让球盘 超时- 半场 '}
// 30: {id: 249, market_type: 'ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME', parent_id: 231, title: '亚洲大小盘- 半场加时赛', title_new: '亚洲大小盘- 半场加时赛'}
// 31: {id: 260, market_type: 'ASIAN_HANDICAP_AFTER_PENALTIES', parent_id: 74, title: '亚洲让球盘 - 点球对决后', title_new: '亚洲让球盘 - 点球对决后'}
// 32: {id: 247, market_type: 'ASIAN_OVER_UNDER_AFTER_PENALTIES', parent_id: 231, title: '亚洲大小盘－罚球', title_new: '亚洲大小盘－罚球'}
// 33: {id: 286, market_type: 'RMM_OUTRIGHTS', parent_id: 0, title: '冠军', title_new: '冠军'}
