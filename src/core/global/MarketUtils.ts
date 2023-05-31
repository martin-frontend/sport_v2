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

    EITHER_TEAM_TO_SCORE: "EITHER_TEAM_TO_SCORE",
    EITHER_TEAM_TO_SCORE_HALF_TIME: "EITHER_TEAM_TO_SCORE_HALF_TIME",

    EITHER_TEAM_TO_SCORE_TWICE_OR_MORE: "EITHER_TEAM_TO_SCORE_TWICE_OR_MORE",
    EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME: "EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME",

    TEAM_A_TO_SCORE: "TEAM_A_TO_SCORE",
    TEAM_A_TO_SCORE_HALF_TIME: "TEAM_A_TO_SCORE_HALF_TIME",
    TEAM_B_TO_SCORE: "TEAM_B_TO_SCORE",
    TEAM_B_TO_SCORE_HALF_TIME: "TEAM_B_TO_SCORE_HALF_TIME",

    TEAM_A_TO_SCORE_TWICE_OR_MORE: "TEAM_A_TO_SCORE_TWICE_OR_MORE",
    TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME: "TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
    TEAM_B_TO_SCORE_TWICE_OR_MORE: "TEAM_B_TO_SCORE_TWICE_OR_MORE",
    TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME: "TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
    BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE: "BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE",
    BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME: "BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME",

    TEAM_A_GOALS_ODD_OR_EVEN: "TEAM_A_GOALS_ODD_OR_EVEN",
    TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME: "TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME",
    TEAM_B_GOALS_ODD_OR_EVEN: "TEAM_B_GOALS_ODD_OR_EVEN",
    TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME: "TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME",
    WAY_HANDICAP_MINUS_4: "3_WAY_HANDICAP_MINUS_4",
    WAY_HANDICAP_MINUS_3: "3_WAY_HANDICAP_MINUS_3",
    WAY_HANDICAP_MINUS_2: "3_WAY_HANDICAP_MINUS_2",
    WAY_HANDICAP_MINUS_1: "3_WAY_HANDICAP_MINUS_1",
    WAY_HANDICAP_PLUS_1: "3_WAY_HANDICAP_PLUS_1",
    WAY_HANDICAP_PLUS_2: "3_WAY_HANDICAP_PLUS_2",
    WAY_HANDICAP_PLUS_3: "3_WAY_HANDICAP_PLUS_3",
    WAY_HANDICAP_PLUS_4: "3_WAY_HANDICAP_PLUS_4",
    WAY_HANDICAP_MINUS_4_HALF_TIME: "3_WAY_HANDICAP_MINUS_4_HALF_TIME",
    WAY_HANDICAP_MINUS_3_HALF_TIME: "3_WAY_HANDICAP_MINUS_3_HALF_TIME",
    WAY_HANDICAP_MINUS_2_HALF_TIME: "3_WAY_HANDICAP_MINUS_2_HALF_TIME",
    WAY_HANDICAP_MINUS_1_HALF_TIME: "3_WAY_HANDICAP_MINUS_1_HALF_TIME",
    WAY_HANDICAP_PLUS_1_HALF_TIME: "3_WAY_HANDICAP_PLUS_1_HALF_TIME",
    WAY_HANDICAP_PLUS_2_HALF_TIME: "3_WAY_HANDICAP_PLUS_2_HALF_TIME",
    WAY_HANDICAP_PLUS_3_HALF_TIME: "3_WAY_HANDICAP_PLUS_3_HALF_TIME",
    WAY_HANDICAP_PLUS_4_HALF_TIME: "3_WAY_HANDICAP_PLUS_4_HALF_TIME",
    WINNING_MARGIN: "WINNING_MARGIN",
    WINNING_MARGIN_HALF_TIME: "WINNING_MARGIN_HALF_TIME",
    TOTAL_GOALS_RANGE: "TOTAL_GOALS_RANGE",
    TOTAL_GOALS_RANGE_HALF_TIME: "TOTAL_GOALS_RANGE_HALF_TIME",
    TEAM_A_EXACT_GOALS: "TEAM_A_EXACT_GOALS",
    TEAM_A_EXACT_GOALS_HALF_TIME: "TEAM_A_EXACT_GOALS_HALF_TIME",
    TEAM_B_EXACT_GOALS: "TEAM_B_EXACT_GOALS",
    TEAM_B_EXACT_GOALS_HALF_TIME: "TEAM_B_EXACT_GOALS_HALF_TIME",
    EITHER_TEAM_TO_SCORE_THREE_OR_MORE: "EITHER_TEAM_TO_SCORE_THREE_OR_MORE",
    EITHER_TEAM_TO_SCORE_THREE_OR_MORE_HALF_TIME: "EITHER_TEAM_TO_SCORE_THREE_OR_MORE_HALF_TIME",

    MATCH_ODDS_AND_OVER_UNDER_2_5: "MATCH_ODDS_AND_OVER_UNDER_2.5",
    MATCH_ODDS_AND_OVER_UNDER_2_5_HALF_TIME: "MATCH_ODDS_AND_OVER_UNDER_2.5_HALF_TIME",
    ODD_OR_EVEN_AND_OVER_UNDER_2_5: "ODD_OR_EVEN_AND_OVER_UNDER_2.5",
    ODD_OR_EVEN_AND_OVER_UNDER_2_5_HALF_TIME: "ODD_OR_EVEN_AND_OVER_UNDER_2.5_HALF_TIME",
    MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE: "MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE",
    MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE_HALF_TIME: "MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE_HALF_TIME",
    BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2_5: "BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2.5",
    BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2_5_HALF_TIME: "BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2.5_HALF_TIME",
    BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE: "BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE",
    BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME: "BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
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
            return (
                (selection.type == "Overs" ? LangUtil("大") : LangUtil("小")) +
                " " +
                formatAsian(selection.handicap, selection.type).substring(1)
            );
        case EnumMarketType.MATCH_ODDS:
        case EnumMarketType.MATCH_ODDS_HALF_TIME:
            return "";
        case EnumMarketType.TOTAL_GOALS:
        case EnumMarketType.TOTAL_GOALS_HALF_TIME:
            return (
                (selection.type == "Overs" ? LangUtil("大") : LangUtil("小")) +
                " " +
                formatAsian(selection.handicap, selection.type).substring(1)
            );
        case EnumMarketType.ODD_OR_EVEN_HALF_TIME:
        case EnumMarketType.ODD_OR_EVEN:
        case EnumMarketType.TEAM_A_GOALS_ODD_OR_EVEN:
        case EnumMarketType.TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME:
        case EnumMarketType.TEAM_B_GOALS_ODD_OR_EVEN:
        case EnumMarketType.TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME:
            return selection.type == "Odd" ? LangUtil("单") : LangUtil("双");
        case EnumMarketType.TEAM_A_WIN_TO_NIL:
        case EnumMarketType.TEAM_B_WIN_TO_NIL:
        case EnumMarketType.TEAM_A_WIN_TO_NIL_HALF_TIME:
        case EnumMarketType.TEAM_B_WIN_TO_NIL_HALF_TIME:
        case EnumMarketType.BOTH_TEAMS_TO_SCORE:
        case EnumMarketType.BOTH_TEAMS_TO_SCORE_HALF_TIME:
        case EnumMarketType.EITHER_TEAM_TO_SCORE:
        case EnumMarketType.EITHER_TEAM_TO_SCORE_HALF_TIME:
        case EnumMarketType.EITHER_TEAM_TO_SCORE_TWICE_OR_MORE:
        case EnumMarketType.EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME:
        case EnumMarketType.TEAM_A_TO_SCORE:
        case EnumMarketType.TEAM_A_TO_SCORE_HALF_TIME:
        case EnumMarketType.TEAM_B_TO_SCORE:
        case EnumMarketType.TEAM_B_TO_SCORE_HALF_TIME:
        case EnumMarketType.TEAM_A_TO_SCORE_TWICE_OR_MORE:
        case EnumMarketType.TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME:
        case EnumMarketType.TEAM_B_TO_SCORE_TWICE_OR_MORE:
        case EnumMarketType.TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME:
        case EnumMarketType.BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE:
        case EnumMarketType.BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME:
        case EnumMarketType.EITHER_TEAM_TO_SCORE_THREE_OR_MORE:
        case EnumMarketType.EITHER_TEAM_TO_SCORE_THREE_OR_MORE_HALF_TIME:
        case EnumMarketType.BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE:
        case EnumMarketType.BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME:
            return selection.type == "Yes" ? LangUtil("是") : LangUtil("否");
        case EnumMarketType.DRAW_NO_BET:
        case EnumMarketType.DRAW_NO_BET_HALF_TIME:
            //@ts-ignore
            return selection.type == "Home" ? matche.home_team : matche.away_team;
        case EnumMarketType.WINNING_MARGIN:
        case EnumMarketType.WINNING_MARGIN_HALF_TIME:
        case EnumMarketType.TOTAL_GOALS_RANGE:
        case EnumMarketType.TOTAL_GOALS_RANGE_HALF_TIME:
        case EnumMarketType.TEAM_A_EXACT_GOALS:
        case EnumMarketType.TEAM_A_EXACT_GOALS_HALF_TIME:
        case EnumMarketType.TEAM_B_EXACT_GOALS:
        case EnumMarketType.TEAM_B_EXACT_GOALS_HALF_TIME:
            switch (selection.type) {
                case "No Winner":
                    return LangUtil("比分平局");
                case "Exactly One":
                    return LangUtil("输赢比数1球");
                case "Exactly Two":
                    return LangUtil("输赢比数2球");
                case "Exactly Three":
                    return LangUtil("输赢比数3球");
                case "Four Or More":
                    return LangUtil("输赢比数4球或更多");

                case "One Or Less":
                    return LangUtil("无进球或1球");
                case "Two Or Three":
                    return LangUtil("2球或3球");
                case "Four Or Five":
                    return LangUtil("4球或5球");
                case "Six Or More":
                    return LangUtil("6球或更多");

                case "Zero":
                    return LangUtil("无进球");
                case "One":
                    return LangUtil("总入球1球");
                case "Two":
                    return LangUtil("总入球2球");
                case "Three":
                    return LangUtil("总入球3球");
                case "Four Or More":
                    return LangUtil("总入球4球或更多");
            }
            return selection.type;
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

    if (selection.type == "Home And Over" && noBet) return `${LangUtil("主")}-${LangUtil("大大")}`;
    if (selection.type == "Home And Under" && noBet) return `${LangUtil("主")}-${LangUtil("小小")}`;
    if (selection.type == "Away And Over" && noBet) return `${LangUtil("客")}-${LangUtil("大大")}`;
    if (selection.type == "Away And Under" && noBet) return `${LangUtil("客")}-${LangUtil("小小")}`;
    if (selection.type == "Draw And Over" && noBet) return `${LangUtil("和")}-${LangUtil("大大")}`;
    if (selection.type == "Draw And Under" && noBet) return `${LangUtil("和")}-${LangUtil("小小")}`;
    if (selection.type == "Odd And Over" && noBet) return `${LangUtil("单")}-${LangUtil("大大")}`;
    if (selection.type == "Odd And Under" && noBet) return `${LangUtil("单")}-${LangUtil("小小")}`;
    if (selection.type == "Even And Over" && noBet) return `${LangUtil("双")}-${LangUtil("大大")}`;
    if (selection.type == "Even And Under" && noBet) return `${LangUtil("双")}-${LangUtil("小小")}`;

    if (selection.type == "Home And Yes" && noBet) return `${LangUtil("主")}-${LangUtil("是")}`;
    if (selection.type == "Home And No" && noBet) return `${LangUtil("主")}-${LangUtil("否")}`;
    if (selection.type == "Away And Yes" && noBet) return `${LangUtil("客")}-${LangUtil("是")}`;
    if (selection.type == "Away And No" && noBet) return `${LangUtil("客")}-${LangUtil("否")}`;
    if (selection.type == "Draw And Yes" && noBet) return `${LangUtil("和")}-${LangUtil("是")}`;
    if (selection.type == "Draw And No" && noBet) return `${LangUtil("和")}-${LangUtil("否")}`;
    if (selection.type == "Yes And Over" && noBet) return `${LangUtil("是")}-${LangUtil("大大")}`;
    if (selection.type == "Yes And Under" && noBet) return `${LangUtil("是")}-${LangUtil("小小")}`;
    if (selection.type == "No And Over" && noBet) return `${LangUtil("否")}-${LangUtil("大大")}`;
    if (selection.type == "No And Under" && noBet) return `${LangUtil("否")}-${LangUtil("小小")}`;

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
