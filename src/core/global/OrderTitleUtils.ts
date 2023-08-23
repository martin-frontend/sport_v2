import EnumMarketType from "@/core/global/MarketUtils";
import LangUtil from "./LangUtil";
const marketType = EnumMarketType.EnumMarketType;
const formatAsian = EnumMarketType.formatAsian;

function getNameByeSelectionType(s_type: string, home_name: string, away_name: string) {
    if (s_type == "Home-Draw") return `${LangUtil(`${home_name}`)}-${LangUtil("和")}`;
    if (s_type == "Away-Draw") return `${LangUtil(`${away_name}`)}-${LangUtil("和")}`;
    if (s_type == "Home-Home") return `${LangUtil(`${home_name}`)}-${LangUtil(`${home_name}`)}`;
    if (s_type == "Home-Away") return `${LangUtil(`${home_name}`)}-${LangUtil(`${away_name}`)}`;
    if (s_type == "Away-Away") return `${LangUtil(`${away_name}`)}-${LangUtil(`${away_name}`)}`;
    if (s_type == "Away-Home") return `${LangUtil(`${away_name}`)}-${LangUtil(`${home_name}`)}`;
    if (s_type == "Draw-Home") return `${LangUtil("和")}-${LangUtil(`${home_name}`)}`;
    if (s_type == "Draw-Draw") return `${LangUtil("和")}-${LangUtil("和")}`;
    if (s_type == "Draw-Away") return `${LangUtil("和")}-${LangUtil(`${away_name}`)}`;

    if (s_type == "Home And Over") return `${LangUtil("主")}-${LangUtil("大大")}`;
    if (s_type == "Home And Under") return `${LangUtil("主")}-${LangUtil("小小")}`;
    if (s_type == "Away And Over") return `${LangUtil("客")}-${LangUtil("大大")}`;
    if (s_type == "Away And Under") return `${LangUtil("客")}-${LangUtil("小小")}`;
    if (s_type == "Draw And Over") return `${LangUtil("和")}-${LangUtil("大大")}`;
    if (s_type == "Draw And Under") return `${LangUtil("和")}-${LangUtil("小小")}`;
    if (s_type == "Odd And Over") return `${LangUtil("单")}-${LangUtil("大大")}`;
    if (s_type == "Odd And Under") return `${LangUtil("单")}-${LangUtil("小小")}`;
    if (s_type == "Even And Over") return `${LangUtil("双")}-${LangUtil("大大")}`;
    if (s_type == "Even And Under") return `${LangUtil("双")}-${LangUtil("小小")}`;

    if (s_type == "Home And Yes") return `${LangUtil("主")}-${LangUtil("是")}`;
    if (s_type == "Home And No") return `${LangUtil("主")}-${LangUtil("否")}`;
    if (s_type == "Away And Yes") return `${LangUtil("客")}-${LangUtil("是")}`;
    if (s_type == "Away And No") return `${LangUtil("主")}-${LangUtil("否")}`;
    if (s_type == "Draw And Yes") return `${LangUtil("和")}-${LangUtil("是")}`;
    if (s_type == "Draw And No") return `${LangUtil("和")}-${LangUtil("否")}`;
    if (s_type == "Yes And Over") return `${LangUtil("是")}-${LangUtil("大大")}`;
    if (s_type == "Yes And Under") return `${LangUtil("是")}-${LangUtil("小小")}`;
    if (s_type == "No And Over") return `${LangUtil("否")}-${LangUtil("大大")}`;
    if (s_type == "No And Under") return `${LangUtil("否")}-${LangUtil("小小")}`;
}
function getOrderTitle({ market_type, s_type, home_name, away_name, content, side, handicap }: any, onOrder: boolean = false) {
    switch (market_type) {
        case marketType.MATCH_ODDS: //主客和
        case marketType.MATCH_ODDS_HALF_TIME: //半场 - 主客和
        case marketType.WAY_HANDICAP_MINUS_4:
        case marketType.WAY_HANDICAP_MINUS_3:
        case marketType.WAY_HANDICAP_MINUS_2:
        case marketType.WAY_HANDICAP_MINUS_1:
        case marketType.WAY_HANDICAP_PLUS_1:
        case marketType.WAY_HANDICAP_PLUS_2:
        case marketType.WAY_HANDICAP_PLUS_3:
        case marketType.WAY_HANDICAP_PLUS_4:
        case marketType.WAY_HANDICAP_MINUS_4_HALF_TIME:
        case marketType.WAY_HANDICAP_MINUS_3_HALF_TIME:
        case marketType.WAY_HANDICAP_MINUS_2_HALF_TIME:
        case marketType.WAY_HANDICAP_MINUS_1_HALF_TIME:
        case marketType.WAY_HANDICAP_PLUS_1_HALF_TIME:
        case marketType.WAY_HANDICAP_PLUS_2_HALF_TIME:
        case marketType.WAY_HANDICAP_PLUS_3_HALF_TIME:
        case marketType.WAY_HANDICAP_PLUS_4_HALF_TIME:
            return s_type == "Home" ? home_name : s_type == "Away" ? away_name : LangUtil("Draw");
        case marketType.TOTAL_GOALS: //总入球
        case marketType.TOTAL_GOALS_HALF_TIME: //半场 - 总入球
        case marketType.ASIAN_OVER_UNDER: //亚洲大小盘
        case marketType.ASIAN_OVER_UNDER_HALF_TIME: //半场 - 亚洲大小盘
        case marketType.CR_ASIAN_OVER_UNDER:
        case marketType.CR_ASIAN_OVER_UNDER_HALF_TIME:
        case marketType.ASIAN_OVER_UNDER_EXTRA_TIME:
        case marketType.ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME:
        case marketType.ASIAN_OVER_UNDER_AFTER_PENALTIES:
            return `${s_type == "Overs" ? LangUtil("大") : LangUtil("小")} ${formatAsian(handicap, s_type).substring(1)}`;
        case marketType.BK_ASIAN_OVER_UNDER:
        case marketType.BK_ASIAN_OVER_UNDER_HALF_TIME:
            return `${s_type == "Over" ? LangUtil("大") : LangUtil("小")} ${formatAsian(handicap, s_type).substring(1)}`;
        case marketType.ASIAN_HANDICAP: //亚洲让球盘
        case marketType.ASIAN_HANDICAP_HALF_TIME: //半场 - 亚洲让球盘
        case marketType.DRAW_NO_BET: //平局退款
        case marketType.DRAW_NO_BET_HALF_TIME: //半场-平局退款
        case marketType.CR_ASIAN_HANDICAP:
        case marketType.CR_ASIAN_HANDICAP_HALF_TIME:
        case marketType.ASIAN_HANDICAP_EXTRA_TIME:
        case marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME:
        case marketType.ASIAN_HANDICAP_AFTER_PENALTIES:
        case marketType.BK_ASIAN_HANDICAP:
        case marketType.BK_ASIAN_HANDICAP_HALF_TIME:
            return `${s_type == "Home" ? home_name : away_name} ${formatAsian(handicap, s_type)}`;
        case marketType.HALF_TIME_FULL_TIME: //半场/全场
            return ` ${formatAsian(handicap, s_type)}`;
        case marketType.BOTH_TEAMS_TO_SCORE: // 两队都得分
        case marketType.BOTH_TEAMS_TO_SCORE_HALF_TIME: //半场-两队都得分
        case marketType.TEAM_A_WIN_TO_NIL: //主队零失球获胜
        case marketType.TEAM_B_WIN_TO_NIL: //客队零失球获胜
        case marketType.TEAM_A_WIN_TO_NIL_HALF_TIME: //半场 - 主队零失球获胜
        case marketType.TEAM_B_WIN_TO_NIL_HALF_TIME: //半场 - 客队零失球获胜
        case marketType.EITHER_TEAM_TO_SCORE:
        case marketType.EITHER_TEAM_TO_SCORE_HALF_TIME:
        case marketType.EITHER_TEAM_TO_SCORE_TWICE_OR_MORE:
        case marketType.EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME:
        case marketType.TEAM_A_TO_SCORE:
        case marketType.TEAM_A_TO_SCORE_HALF_TIME:
        case marketType.TEAM_B_TO_SCORE:
        case marketType.TEAM_B_TO_SCORE_HALF_TIME:
        case marketType.TEAM_A_TO_SCORE_TWICE_OR_MORE:
        case marketType.TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME:
        case marketType.TEAM_B_TO_SCORE_TWICE_OR_MORE:
        case marketType.TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME:
        case marketType.BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE:
        case marketType.BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME:
        case marketType.EITHER_TEAM_TO_SCORE_THREE_OR_MORE:
        case marketType.EITHER_TEAM_TO_SCORE_THREE_OR_MORE_HALF_TIME:
        case marketType.BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE:
        case marketType.BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME:
            return `${s_type == "Yes" ? LangUtil("是") : LangUtil("否")} ${formatAsian(handicap, s_type)}`;
        case marketType.ODD_OR_EVEN_HALF_TIME: //半场 - 单/双
        case marketType.ODD_OR_EVEN: //入球单双
        case marketType.TEAM_A_GOALS_ODD_OR_EVEN:
        case marketType.TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME:
        case marketType.TEAM_B_GOALS_ODD_OR_EVEN:
        case marketType.TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME:
            return `${s_type == "Odd" ? LangUtil("单") : LangUtil("双")} ${formatAsian(handicap, s_type)}`;
        case marketType.WINNING_MARGIN:
        case marketType.WINNING_MARGIN_HALF_TIME:
        case marketType.TOTAL_GOALS_RANGE:
        case marketType.TOTAL_GOALS_RANGE_HALF_TIME:
        case marketType.TEAM_A_EXACT_GOALS:
        case marketType.TEAM_A_EXACT_GOALS_HALF_TIME:
        case marketType.TEAM_B_EXACT_GOALS:
        case marketType.TEAM_B_EXACT_GOALS_HALF_TIME:
            switch (s_type) {
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
            return s_type;
        case marketType.CORRECT_SCORE: //'波胆'
        case marketType.CORRECT_SCORE_HALF_TIME: //半场 - 波胆
            return s_type == "" ? LangUtil("其它") : s_type;
        case marketType.BK_ASIAN_HANDICAP: //亚洲让分盘 - 罚牌数
        case marketType.BK_ASIAN_HANDICAP_HALF_TIME: //亚洲让分盘 - 罚牌数
            return "";
        case marketType.WAY_OVER_UNDER_1:
        case marketType.WAY_OVER_UNDER_2:
        case marketType.WAY_OVER_UNDER_3:
        case marketType.WAY_OVER_UNDER_4:
        case marketType.WAY_OVER_UNDER_5:
        case marketType.WAY_OVER_UNDER_6:
        case marketType.WAY_OVER_UNDER_7:
        case marketType.WAY_OVER_UNDER_8:
        case marketType.WAY_OVER_UNDER_1_HALF_TIME:
        case marketType.WAY_OVER_UNDER_2_HALF_TIME:
        case marketType.WAY_OVER_UNDER_3_HALF_TIME:
        case marketType.WAY_OVER_UNDER_4_HALF_TIME:
        case marketType.WAY_OVER_UNDER_5_HALF_TIME:
        case marketType.WAY_OVER_UNDER_6_HALF_TIME:
        case marketType.WAY_OVER_UNDER_7_HALF_TIME:
        case marketType.WAY_OVER_UNDER_8_HALF_TIME: {
            console.warn("--s_type--", s_type);
            // return `${s_type == "Over" ? LangUtil("大大") : s_type == "Under" ? LangUtil("小小") : LangUtil("和和")}`;
            return `${s_type == "Over" ? LangUtil("大大") : s_type == "Exactly" ? LangUtil("和和") : LangUtil("小小")}`;
        }
    }
}
//special > 注单记录 双重机会/双胜彩
function getTeamName(data: any, special: boolean = true) {
    const teamType = ["Home", "Away", "Draw"];
    const marketType = [
        "HALF_TIME_FULL_TIME",
        "DOUBLE_CHANCE",
        "DOUBLE_CHANCE_HALF_TIME",

        "MATCH_ODDS_AND_OVER_UNDER_2.5",
        "MATCH_ODDS_AND_OVER_UNDER_2.5_HALF_TIME",

        "MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE",
        "MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE_HALF_TIME",

        "BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2.5",
        "BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2.5_HALF_TIME",

        "ODD_OR_EVEN_AND_OVER_UNDER_2.5",
        "ODD_OR_EVEN_AND_OVER_UNDER_2.5_HALF_TIME",
    ];
    const notMarketType = ["DRAW_NO_BET", "DRAW_NO_BET_HALF_TIME"];
    if (special) {
        if (teamType.includes(data.selection.type) && !notMarketType.includes(data.market.market_type)) {
            switch (data.selection.type) {
                case "Home":
                    return `${data.matche.home_team} `;
                case "Away":
                    return `${data.matche.away_team} `;
                case "Draw":
                    return LangUtil("Draw");
            }
        }
        return marketType.includes(data.market.market_type)
            ? getNameByeSelectionType(data.selection.type, data.matche.home_team, data.matche.away_team)
            : "";
    } else {
        return marketType.includes(data.market_type) ? getNameByeSelectionType(data.s_type, data.home_name, data.away_name) : "";
    }
}
//判断盘口是否是上半场盘口 如果是 返回true
function IsOnlyFirstHalf(market_type: string) {
    const firstHalfarr = [
        marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME,
        marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME,
        marketType.DOUBLE_CHANCE_HALF_TIME,
        marketType.MATCH_ODDS_HALF_TIME,
        marketType.TOTAL_GOALS_HALF_TIME,
        marketType.ASIAN_OVER_UNDER_HALF_TIME,
        marketType.ASIAN_HANDICAP_HALF_TIME,
        marketType.DRAW_NO_BET_HALF_TIME,
        marketType.BOTH_TEAMS_TO_SCORE_HALF_TIME,
        marketType.TEAM_A_WIN_TO_NIL_HALF_TIME,
        marketType.TEAM_B_WIN_TO_NIL_HALF_TIME,
        marketType.ODD_OR_EVEN_HALF_TIME,
        marketType.CORRECT_SCORE_HALF_TIME,

        marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME,
        marketType.ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME,
        marketType.EITHER_TEAM_TO_SCORE_HALF_TIME,
        marketType.EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME,
        marketType.TEAM_A_TO_SCORE_HALF_TIME,
        marketType.TEAM_B_TO_SCORE_HALF_TIME,
        marketType.TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME,
        marketType.TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME,
        marketType.BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME,
        marketType.TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME,
        marketType.TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME,
    ];
    return firstHalfarr.indexOf(market_type) != -1;
}

//获取比分说明 是角球点球还是比分等
function getScoreStr(item: any) {
    const cornersMarket_type = [
        marketType.CR_ASIAN_HANDICAP,
        marketType.CR_ASIAN_HANDICAP_HALF_TIME,
        marketType.CR_ASIAN_OVER_UNDER,
        marketType.CR_ASIAN_OVER_UNDER_HALF_TIME,
    ]; //角球
    const addtimeHalfMarket_type = [marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME, marketType.ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME]; //半场加时
    const addtimeMarket_type = [marketType.ASIAN_HANDICAP_EXTRA_TIME, marketType.ASIAN_OVER_UNDER_EXTRA_TIME]; //全场加时
    const AFTER_Market_type = [marketType.ASIAN_HANDICAP_AFTER_PENALTIES, marketType.ASIAN_OVER_UNDER_AFTER_PENALTIES]; //点球
    const firstHalfarr = [
        marketType.EITHER_TEAM_TO_SCORE_HALF_TIME,
        marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME,
        marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME,
        marketType.DOUBLE_CHANCE_HALF_TIME,
        marketType.MATCH_ODDS_HALF_TIME,
        marketType.TOTAL_GOALS_HALF_TIME,
        marketType.ASIAN_OVER_UNDER_HALF_TIME,
        marketType.ASIAN_HANDICAP_HALF_TIME,
        marketType.DRAW_NO_BET_HALF_TIME,
        marketType.BOTH_TEAMS_TO_SCORE_HALF_TIME,
        marketType.TEAM_A_WIN_TO_NIL_HALF_TIME,
        marketType.TEAM_B_WIN_TO_NIL_HALF_TIME,
        marketType.ODD_OR_EVEN_HALF_TIME,
        marketType.CORRECT_SCORE_HALF_TIME,
        marketType.MATCH_ODDS_HALF_TIME,
        marketType.DRAW_NO_BET_HALF_TIME,
        marketType.TOTAL_GOALS_HALF_TIME,
        marketType.ODD_OR_EVEN_HALF_TIME,
        marketType.CORRECT_SCORE_HALF_TIME,
        marketType.DOUBLE_CHANCE_HALF_TIME,
        marketType.WINNING_MARGIN_HALF_TIME,
        marketType.TEAM_A_TO_SCORE_HALF_TIME,
        marketType.TEAM_B_TO_SCORE_HALF_TIME,
        marketType.ASIAN_OVER_UNDER_HALF_TIME,
        marketType.TEAM_A_WIN_TO_NIL_HALF_TIME,
        marketType.TEAM_B_WIN_TO_NIL_HALF_TIME,
        marketType.TOTAL_GOALS_RANGE_HALF_TIME,
        marketType.TEAM_A_EXACT_GOALS_HALF_TIME,
        marketType.TEAM_B_EXACT_GOALS_HALF_TIME,
        marketType.BOTH_TEAMS_TO_SCORE_HALF_TIME,
        marketType.EITHER_TEAM_TO_SCORE_HALF_TIME,
        marketType.WAY_OVER_UNDER_1_HALF_TIME,
        marketType.WAY_OVER_UNDER_2_HALF_TIME,
        marketType.WAY_OVER_UNDER_3_HALF_TIME,
        marketType.WAY_OVER_UNDER_4_HALF_TIME,
        marketType.WAY_OVER_UNDER_5_HALF_TIME,
        marketType.WAY_OVER_UNDER_6_HALF_TIME,
        marketType.WAY_OVER_UNDER_7_HALF_TIME,
        marketType.WAY_OVER_UNDER_8_HALF_TIME,
        marketType.WAY_HANDICAP_MINUS_4_HALF_TIME,
        marketType.WAY_HANDICAP_MINUS_3_HALF_TIME,
        marketType.WAY_HANDICAP_MINUS_2_HALF_TIME,
        marketType.WAY_HANDICAP_MINUS_1_HALF_TIME,
        marketType.WAY_HANDICAP_PLUS_1_HALF_TIME,
        marketType.WAY_HANDICAP_PLUS_2_HALF_TIME,
        marketType.WAY_HANDICAP_PLUS_3_HALF_TIME,
        marketType.WAY_HANDICAP_PLUS_4_HALF_TIME,
        marketType.TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME,
        marketType.TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME,
        marketType.TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME,
        marketType.TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME,
        marketType.MATCH_ODDS_AND_OVER_UNDER_2_5_HALF_TIME,
        marketType.ODD_OR_EVEN_AND_OVER_UNDER_2_5_HALF_TIME,
        marketType.BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME,
        marketType.EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME,
        marketType.EITHER_TEAM_TO_SCORE_THREE_OR_MORE_HALF_TIME,
        marketType.MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE_HALF_TIME,
        marketType.BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2_5_HALF_TIME,
        marketType.BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME,
    ];
    /**罚牌数量 */
    const cardMarket_type = [
        marketType.BK_ASIAN_HANDICAP,
        marketType.BK_ASIAN_HANDICAP_HALF_TIME,
        marketType.BK_ASIAN_OVER_UNDER,
        marketType.BK_ASIAN_OVER_UNDER_HALF_TIME,
    ];
    const state = Object.keys(item.state || {}).length > 0 ? item.state : item.real_time_state ? item.real_time_state : item.state;
    if (!state) {
        return "";
    }
    if (cornersMarket_type.indexOf(item.market_type) != -1) {
        if (!state.corners_ft) return "";
        return " " + LangUtil("角球") + "(" + state.corners_ft + ")";
    } else if (addtimeHalfMarket_type.indexOf(item.market_type) != -1) {
        if (!state.goals_otht) return "";
        return " " + LangUtil("半场加时") + "(" + state.goals_otht + ")";
    } else if (addtimeMarket_type.indexOf(item.market_type) != -1) {
        if (!state.goals_ot) return "";
        return " " + LangUtil("加时") + "(" + state.goals_ot + ")";
    } else if (AFTER_Market_type.indexOf(item.market_type) != -1) {
        if (!state.goals_pk) return "";
        return " " + LangUtil("点球") + "(" + state.goals_pk + ")";
    } else if (firstHalfarr.indexOf(item.market_type) != -1) {
        if (!state.goals_ht) return "";
        return " " + LangUtil("半场比分") + "(" + state.goals_ht + ")";
    } else if (cardMarket_type.indexOf(item.market_type) != -1) {
        if (!state.yellow_cards_ft && !state.red_cards_ft) return "";
        // return " " + LangUtil("罚牌") + "(" + state.yellow_cards_ht + ")";
        return (
            " " +
            LangUtil("黄牌") +
            "(" +
            state.yellow_cards_ft +
            ")" +
            "<br/>" +
            LangUtil("红牌") +
            "(" +
            state.red_cards_ft +
            ")"
        );
    } else {
        if (!state.goals_ft) return "";
        return " " + LangUtil("比分") + "(" + state.goals_ft + ")";
    }
}

const Way_Handicap: string | string[] = [
    marketType.WAY_HANDICAP_MINUS_4,
    marketType.WAY_HANDICAP_MINUS_3,
    marketType.WAY_HANDICAP_MINUS_2,
    marketType.WAY_HANDICAP_MINUS_1,
    marketType.WAY_HANDICAP_PLUS_1,
    marketType.WAY_HANDICAP_PLUS_2,
    marketType.WAY_HANDICAP_PLUS_3,
    marketType.WAY_HANDICAP_PLUS_4,
    marketType.WAY_HANDICAP_MINUS_4_HALF_TIME,
    marketType.WAY_HANDICAP_MINUS_3_HALF_TIME,
    marketType.WAY_HANDICAP_MINUS_2_HALF_TIME,
    marketType.WAY_HANDICAP_MINUS_1_HALF_TIME,
    marketType.WAY_HANDICAP_PLUS_1_HALF_TIME,
    marketType.WAY_HANDICAP_PLUS_2_HALF_TIME,
    marketType.WAY_HANDICAP_PLUS_3_HALF_TIME,
    marketType.WAY_HANDICAP_PLUS_4_HALF_TIME,
];
//预算结果逻辑
function advance_result(orderItem: any, playingState: any) {
    //1赢 2半赢 3平 4输 5输一半
    const result_tb = <any>{ win_type: 0, win_num: 0 };
    let handicap = orderItem.handicap;
    handicap = Number(handicap);

    //是否是滚球
    const isPlaying = Object.keys(orderItem.state).length > 0;
    const findWay_HandicapIdx = Way_Handicap.indexOf(orderItem.market_type);
    //主客和
    if (orderItem.market_type == marketType.MATCH_ODDS) {
        const goalsarr = playingState.goals_ft.split("-");
        const differ = Number(goalsarr[0]) - Number(goalsarr[1]);
        if (orderItem.s_type == "Home") {
            result_tb.win_type = differ > 0 ? 1 : 4;
        } else if (orderItem.s_type == "Draw") {
            result_tb.win_type = differ == 0 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            result_tb.win_type = differ < 0 ? 1 : 4;
        }
    } else if (findWay_HandicapIdx != -1) {
        const numarr = [4, 3, 2, 1, -1, -2, -3, -4, 4, 3, 2, 1, -1, -2, -3, -4];
        let Way_handicap = numarr[findWay_HandicapIdx];
        let goalsarr = playingState.goals_ft.split("-"); //事实的比分
        if (findWay_HandicapIdx > 7) {
            //半场
            goalsarr = playingState.goals_ht.split("-"); //事实的比分
        }
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        const score = goalsarr[0] + Way_handicap - goalsarr[1];
        if (orderItem.s_type == "Home") {
            result_tb.win_type = score > 0 ? 1 : 4;
        } else if (orderItem.s_type == "Draw") {
            result_tb.win_type = score == 0 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            result_tb.win_type = score < 0 ? 1 : 4;
        }
    }
    //半场-主客和
    else if (orderItem.market_type == marketType.MATCH_ODDS_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const differ = Number(goalsarr[0]) - Number(goalsarr[1]);
        if (orderItem.s_type == "Home") {
            result_tb.win_type = differ > 0 ? 1 : 4;
        } else if (orderItem.s_type == "Draw") {
            result_tb.win_type = differ == 0 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            result_tb.win_type = differ < 0 ? 1 : 4;
        }
    }
    //滚球中的亚洲让球
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP && isPlaying) {
        const goalsarr = playingState.goals_ft.split("-"); //事实的比分
        const betgoalsarr = orderItem.state.goals_ft.split("-"); //快照时候的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        betgoalsarr[0] = Number(betgoalsarr[0]);
        betgoalsarr[1] = Number(betgoalsarr[1]);

        if (orderItem.s_type == "Home") {
            const score = handicap + (goalsarr[0] - betgoalsarr[0]) - (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - betgoalsarr[0] - (handicap + (goalsarr[1] - betgoalsarr[1]));
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //滚球中的半场-亚洲让球
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP_HALF_TIME && isPlaying) {
        const goalsarr = playingState.goals_ht.split("-"); //事实的比分 0-2
        const betgoalsarr = orderItem.state.goals_ht.split("-"); //快照时候的比分 0-1
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        betgoalsarr[0] = Number(betgoalsarr[0]);
        betgoalsarr[1] = Number(betgoalsarr[1]);

        if (orderItem.s_type == "Home") {
            const score = handicap + (goalsarr[0] - betgoalsarr[0]) - (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - betgoalsarr[0] - (handicap + (goalsarr[1] - betgoalsarr[1]));
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //滚球中的亚洲让球盘-角球
    else if (orderItem.market_type == marketType.CR_ASIAN_HANDICAP && isPlaying) {
        const goalsarr = playingState.corners_ft.split("-"); //事实的比分
        const betgoalsarr = orderItem.state.corners_ft.split("-"); //快照时候的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        betgoalsarr[0] = Number(betgoalsarr[0]);
        betgoalsarr[1] = Number(betgoalsarr[1]);

        if (orderItem.s_type == "Home") {
            const score = handicap + (goalsarr[0] - betgoalsarr[0]) - (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - betgoalsarr[0] - (handicap + (goalsarr[0] - betgoalsarr[1]));
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    } else if (orderItem.market_type == marketType.CR_ASIAN_HANDICAP_HALF_TIME && isPlaying) {
        const goalsarr = playingState.corners_ht.split("-"); //事实的比分
        const betgoalsarr = orderItem.state.corners_ht.split("-"); //快照时候的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        betgoalsarr[0] = Number(betgoalsarr[0]);
        betgoalsarr[1] = Number(betgoalsarr[1]);

        if (orderItem.s_type == "Home") {
            const score = handicap + (goalsarr[0] - betgoalsarr[0]) - (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - betgoalsarr[0] - (handicap + (goalsarr[0] - betgoalsarr[1]));
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }

    //亚洲让球盘
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP) {
        const goalsarr = playingState.goals_ft.split("-");
        if (orderItem.s_type == "Home") {
            const score = handicap + Number(goalsarr[0]) - Number(goalsarr[1]);
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = Number(goalsarr[0]) - (handicap + Number(goalsarr[1]));
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }

    //半场-亚洲让球
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        if (orderItem.s_type == "Home") {
            const score = handicap + Number(goalsarr[0]) - Number(goalsarr[1]);
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = Number(goalsarr[0]) - (handicap + Number(goalsarr[1]));
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //亚洲让球盘-角球
    else if (orderItem.market_type == marketType.CR_ASIAN_HANDICAP || orderItem.market_type == marketType.CR_ASIAN_HANDICAP_HALF_TIME) {
        const goalsarr = playingState.corners_ft.split("-");
        if (orderItem.s_type == "Home") {
            const score = handicap + Number(goalsarr[0]) - Number(goalsarr[1]);
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = Number(goalsarr[0]) - (handicap + Number(goalsarr[1]));
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //双重机会/双胜彩
    else if (orderItem.market_type == marketType.DOUBLE_CHANCE) {
        const goalsarr = playingState.goals_ft.split("-");
        const differ = Number(goalsarr[0]) - Number(goalsarr[1]);
        const myBet = orderItem.s_type.split("-");
        const differscore = differ >= 1 ? 1 : differ <= -1 ? -1 : 0;
        const diffstr = differscore == 0 ? "Draw" : differscore == 1 ? "Home" : "Away";
        result_tb.win_type = myBet[0] == diffstr || myBet[1] == diffstr ? 1 : 4;
    }
    // 半场-双重机会/双胜彩
    else if (orderItem.market_type == marketType.DOUBLE_CHANCE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const differ = Number(goalsarr[0]) - Number(goalsarr[1]);
        const myBet = orderItem.s_type.split("-");
        const differscore = differ >= 1 ? 1 : differ <= -1 ? -1 : 0;
        const diffstr = differscore == 0 ? "Draw" : differscore == 1 ? "Home" : "Away";
        result_tb.win_type = myBet[0] == diffstr || myBet[1] == diffstr ? 1 : 4;
    }
    //平局退款
    else if (orderItem.market_type == marketType.DRAW_NO_BET) {
        const goalsarr = playingState.goals_ft.split("-");
        const differ = Number(goalsarr[0]) - Number(goalsarr[1]);
        if (orderItem.s_type == "Home") {
            result_tb.win_type = differ > 0 ? 1 : differ < 0 ? 4 : 3;
        } else if (orderItem.s_type == "Away") {
            result_tb.win_type = differ < 0 ? 1 : differ > 0 ? 4 : 3;
        }
    }
    //半场-平局退款
    else if (orderItem.market_type == marketType.DRAW_NO_BET_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const differ = Number(goalsarr[0]) - Number(goalsarr[1]);
        if (orderItem.s_type == "Home") {
            result_tb.win_type = differ > 0 ? 1 : differ < 0 ? 4 : 3;
        } else if (orderItem.s_type == "Away") {
            result_tb.win_type = differ < 0 ? 1 : differ > 0 ? 4 : 3;
        }
    }
    //两队都得分
    else if (orderItem.market_type == marketType.BOTH_TEAMS_TO_SCORE) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[0]) > 0 && Number(goalsarr[1]) > 0;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //半场-两队都得分
    else if (orderItem.market_type == marketType.BOTH_TEAMS_TO_SCORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[0]) > 0 && Number(goalsarr[1]) > 0;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //亚洲大小盘
    else if (orderItem.market_type == marketType.ASIAN_OVER_UNDER) {
        const goalsarr = playingState.goals_ft.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }
    //半场-亚洲大小盘
    else if (orderItem.market_type == marketType.ASIAN_OVER_UNDER_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }
    //亚洲大小盘-半场加时
    else if (orderItem.market_type == marketType.ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME) {
        const goalsarr = playingState.goals_otht.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }
    //亚洲大小盘-加时
    else if (orderItem.market_type == marketType.ASIAN_OVER_UNDER_EXTRA_TIME) {
        const goalsarr = playingState.goals_ot.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }
    //亚洲大小盘-点球
    else if (orderItem.market_type == marketType.ASIAN_OVER_UNDER_AFTER_PENALTIES) {
        const goalsarr = playingState.goals_pk.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }
    //亚洲让球-点球
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP_AFTER_PENALTIES) {
        const goalsarr = playingState.goals_pk.split("-"); //事实的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        if (orderItem.s_type == "Home") {
            const score = handicap + goalsarr[0] - goalsarr[1];
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - (handicap + goalsarr[1]);
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //总入球
    else if (orderItem.market_type == marketType.TOTAL_GOALS) {
        const goalsarr = playingState.goals_ft.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }
    //半场-总入球
    else if (orderItem.market_type == marketType.TOTAL_GOALS_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }
    //亚洲大小盘-角球
    else if (orderItem.market_type == marketType.CR_ASIAN_OVER_UNDER) {
        const goalsarr = playingState.corners_ft.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }
    //亚洲大小盘-角球-半场
    else if (orderItem.market_type == marketType.CR_ASIAN_OVER_UNDER_HALF_TIME) {
        const goalsarr = playingState.corners_ht.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }
    //主队零失球获胜
    else if (orderItem.market_type == marketType.TEAM_A_WIN_TO_NIL) {
        const goalsarr = playingState.goals_ft.split("-");
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = Number(goalsarr[1]) > 0 || Number(goalsarr[0]) == 0 ? 4 : 1;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = Number(goalsarr[1]) > 0 || Number(goalsarr[0]) == 0 ? 1 : 4;
        }
    }
    //半场 - 主队零失球获胜
    else if (orderItem.market_type == marketType.TEAM_A_WIN_TO_NIL_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = Number(goalsarr[1]) > 0 || Number(goalsarr[0]) == 0 ? 4 : 1;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = Number(goalsarr[1]) > 0 || Number(goalsarr[0]) == 0 ? 1 : 4;
        }
    }
    //客队零失球获胜
    else if (orderItem.market_type == marketType.TEAM_B_WIN_TO_NIL) {
        const goalsarr = playingState.goals_ft.split("-");
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = Number(goalsarr[0]) > 0 || Number(goalsarr[1]) == 0 ? 4 : 1;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = Number(goalsarr[0]) > 0 || Number(goalsarr[1]) == 0 ? 1 : 4;
        }
    }
    //半场 - 客队零失球获胜
    else if (orderItem.market_type == marketType.TEAM_B_WIN_TO_NIL_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = Number(goalsarr[0]) > 0 || Number(goalsarr[1]) == 0 ? 4 : 1;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = Number(goalsarr[0]) > 0 || Number(goalsarr[1]) == 0 ? 1 : 4;
        }
    }
    //入球单双
    else if (orderItem.market_type == marketType.ODD_OR_EVEN) {
        const goalsarr = playingState.goals_ft.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        if (orderItem.s_type == "Odd") {
            result_tb.win_type = allscore % 2 == 0 ? 4 : 1;
        } else if (orderItem.s_type == "Even") {
            result_tb.win_type = allscore % 2 == 0 ? 1 : 4;
        }
    }
    //半场-入球单双
    else if (orderItem.market_type == marketType.ODD_OR_EVEN_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        if (orderItem.s_type == "Odd") {
            result_tb.win_type = allscore % 2 == 0 ? 4 : 1;
        } else if (orderItem.s_type == "Even") {
            result_tb.win_type = allscore % 2 == 0 ? 1 : 4;
        }
    }
    //波胆
    else if (orderItem.market_type == marketType.CORRECT_SCORE) {
        const goalsarr = playingState.goals_ft.split("-");
        const mybet = orderItem.s_type.split("-");
        result_tb.win_type = Number(goalsarr[0]) == Number(mybet[0]) && Number(goalsarr[1]) == Number(mybet[1]) ? 1 : 4;
    }
    //半场-波胆
    else if (orderItem.market_type == marketType.CORRECT_SCORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const mybet = orderItem.s_type.split("-");
        result_tb.win_type = Number(goalsarr[0]) == Number(mybet[0]) && Number(goalsarr[1]) == Number(mybet[1]) ? 1 : 4;
    }
    //半场/全场
    else if (orderItem.market_type == marketType.HALF_TIME_FULL_TIME) {
        const goalsarr = playingState.goals_ft.split("-");
        const Halfgoalsarr = playingState.goals_ht.split("-");
        const halfstr =
            Number(Halfgoalsarr[0]) == Number(Halfgoalsarr[1])
                ? "Draw"
                : Number(Halfgoalsarr[0]) > Number(Halfgoalsarr[1])
                ? "Home"
                : "Away";
        const allstr = Number(goalsarr[0]) == Number(goalsarr[1]) ? "Draw" : Number(goalsarr[0]) > Number(goalsarr[1]) ? "Home" : "Away";
        const resultstr = halfstr + "-" + allstr;
        result_tb.win_type = orderItem.s_type == resultstr ? 1 : 4;
    }
    //滚球中的亚洲让球盘 半场加时
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME && isPlaying) {
        const goalsarr = playingState.goals_otht.split("-"); //事实的比分
        const betgoalsarr = orderItem.state.goals_otht.split("-"); //快照时候的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        betgoalsarr[0] = Number(betgoalsarr[0]);
        betgoalsarr[1] = Number(betgoalsarr[1]);

        if (orderItem.s_type == "Home") {
            const score = handicap + (goalsarr[0] - betgoalsarr[0]) - (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - betgoalsarr[0] - (handicap + (goalsarr[1] - betgoalsarr[1]));
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //亚洲让球盘 半场加时
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME) {
        const goalsarr = playingState.goals_otht.split("-"); //事实的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        if (orderItem.s_type == "Home") {
            const score = handicap + goalsarr[0] - goalsarr[1];
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - (handicap + goalsarr[1]);

            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //滚球中的亚洲让球盘 加时
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP_EXTRA_TIME && isPlaying) {
        const goalsarr = playingState.goals_ot.split("-"); //事实的比分
        const betgoalsarr = orderItem.state.goals_ot.split("-"); //快照时候的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        betgoalsarr[0] = Number(betgoalsarr[0]);
        betgoalsarr[1] = Number(betgoalsarr[1]);

        if (orderItem.s_type == "Home") {
            const score = handicap + (goalsarr[0] - betgoalsarr[0]) - (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - betgoalsarr[0] - (handicap + (goalsarr[1] - betgoalsarr[1]));
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //亚洲让球盘 加时
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP_EXTRA_TIME) {
        const goalsarr = playingState.goals_ot.split("-"); //事实的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        if (orderItem.s_type == "Home") {
            const score = handicap + goalsarr[0] - goalsarr[1];
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - (handicap + goalsarr[1]);

            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //任意一队得分
    else if (orderItem.market_type == marketType.EITHER_TEAM_TO_SCORE) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[0]) > 0 || Number(goalsarr[1]) > 0;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //半场 - 任意一队得分
    else if (orderItem.market_type == marketType.EITHER_TEAM_TO_SCORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[0]) > 0 || Number(goalsarr[1]) > 0;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //任意一队得两分或以上
    else if (orderItem.market_type == marketType.EITHER_TEAM_TO_SCORE_TWICE_OR_MORE) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[0]) > 1 || Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //半场 - 任意一队得分两次或以上
    else if (orderItem.market_type == marketType.EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[0]) > 1 || Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //主队得分
    else if (orderItem.market_type == marketType.TEAM_A_TO_SCORE) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[0]) > 0;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //半场 - 主队得分
    else if (orderItem.market_type == marketType.TEAM_A_TO_SCORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[0]) > 0;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //客队得分
    else if (orderItem.market_type == marketType.TEAM_B_TO_SCORE) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[1]) > 0;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //半场 - 客队得分
    else if (orderItem.market_type == marketType.TEAM_B_TO_SCORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[1]) > 0;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //主队得分单/双
    else if (orderItem.market_type == marketType.TEAM_A_GOALS_ODD_OR_EVEN) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[0]) % 2 == 0;
        if (orderItem.s_type == "Even") {
            //双
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "Odd") {
            //单
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //半场 - 主队得分单/双
    else if (orderItem.market_type == marketType.TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[0]) % 2 == 0;
        if (orderItem.s_type == "Even") {
            //双
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "Odd") {
            //单
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //客队得分单/双
    else if (orderItem.market_type == marketType.TEAM_B_GOALS_ODD_OR_EVEN) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[1]) % 2 == 0;
        if (orderItem.s_type == "Even") {
            //双
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "Odd") {
            //单
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //半场 - 客队得分单/双
    else if (orderItem.market_type == marketType.TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[1]) % 2 == 0;
        if (orderItem.s_type == "Even") {
            //双
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "Odd") {
            //单
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //主队得分两次或以上
    else if (orderItem.market_type == marketType.TEAM_A_TO_SCORE_TWICE_OR_MORE) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[0]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	半场 - 主队得分两次或以上
    else if (orderItem.market_type == marketType.TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[0]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	客队得分两次或以上
    else if (orderItem.market_type == marketType.TEAM_B_TO_SCORE_TWICE_OR_MORE) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	半场 - 客队得分两次或以上
    else if (orderItem.market_type == marketType.TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	两队都得分兩次或以上
    else if (orderItem.market_type == marketType.BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[0]) > 1 && Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	半场 - 两队都得分两次或以上
    else if (orderItem.market_type == marketType.BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[0]) > 1 && Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	输赢比数 包括半场
    else if (orderItem.market_type == marketType.WINNING_MARGIN || orderItem.market_type == marketType.WINNING_MARGIN_HALF_TIME) {
        let goalsarr = playingState.goals_ft.split("-");
        if (orderItem.market_type == marketType.WINNING_MARGIN_HALF_TIME) {
            goalsarr = playingState.goals_ht.split("-");
        }

        const result = Number(goalsarr[0]) - Number(goalsarr[1]);
        if (orderItem.s_type == "No Winner") {
            result_tb.win_type = result == 0 ? 1 : 4;
        } else if (orderItem.s_type == "Exactly One") {
            result_tb.win_type = result == 1 ? 1 : 4;
        } else if (orderItem.s_type == "Exactly Two") {
            result_tb.win_type = result == 2 ? 1 : 4;
        } else if (orderItem.s_type == "Exactly Three") {
            result_tb.win_type = result == 3 ? 1 : 4;
        } else if (orderItem.s_type == "Four Or More") {
            result_tb.win_type = result > 3 ? 1 : 4;
        }
    }
    //	总入球范围  包括半场
    else if (orderItem.market_type == marketType.TOTAL_GOALS_RANGE || orderItem.market_type == marketType.TOTAL_GOALS_RANGE_HALF_TIME) {
        let goalsarr = playingState.goals_ft.split("-");
        if (orderItem.market_type == marketType.TOTAL_GOALS_RANGE_HALF_TIME) {
            goalsarr = playingState.goals_ht.split("-");
        }
        const result = Number(goalsarr[0]) + Number(goalsarr[1]);
        if (orderItem.s_type == "One Or Less") {
            result_tb.win_type = result <= 1 ? 1 : 4;
        } else if (orderItem.s_type == "Two Or Three") {
            result_tb.win_type = result >= 2 && result <= 3 ? 1 : 4;
        } else if (orderItem.s_type == "Four Or Five") {
            result_tb.win_type = result >= 4 && result <= 5 ? 1 : 4;
        } else if (orderItem.s_type == "Six Or More") {
            result_tb.win_type = result > 5 ? 1 : 4;
        }
    }
    //	主队总入球 客队总入球  包括半场
    else if (
        orderItem.market_type == marketType.TEAM_A_EXACT_GOALS ||
        orderItem.market_type == marketType.TEAM_A_EXACT_GOALS_HALF_TIME ||
        marketType.TEAM_B_EXACT_GOALS ||
        orderItem.market_type == marketType.TEAM_B_EXACT_GOALS_HALF_TIME
    ) {
        let goalsarr = playingState.goals_ft.split("-");
        let result = Number(goalsarr[0]);
        if (
            orderItem.market_type == marketType.TEAM_A_EXACT_GOALS_HALF_TIME ||
            orderItem.market_type == marketType.TEAM_B_EXACT_GOALS_HALF_TIME
        ) {
            goalsarr = playingState.goals_ht.split("-");
            result = Number(goalsarr[1]);
        }

        if (orderItem.s_type == "Zero") {
            result_tb.win_type = result == 0 ? 1 : 4;
        } else if (orderItem.s_type == "One") {
            result_tb.win_type = result == 1 ? 1 : 4;
        } else if (orderItem.s_type == "Two") {
            result_tb.win_type = result == 2 ? 1 : 4;
        } else if (orderItem.s_type == "Three") {
            result_tb.win_type = result == 3 ? 1 : 4;
        } else if (orderItem.s_type == "Four Or More") {
            result_tb.win_type = result > 3 ? 1 : 4;
        }
    }
    //	任意一队得三分或以上 包括半场
    else if (
        orderItem.market_type == marketType.EITHER_TEAM_TO_SCORE_THREE_OR_MORE ||
        marketType.EITHER_TEAM_TO_SCORE_THREE_OR_MORE_HALF_TIME
    ) {
        let goalsarr = playingState.goals_ft.split("-");
        if (orderItem.market_type == marketType.EITHER_TEAM_TO_SCORE_THREE_OR_MORE_HALF_TIME) {
            goalsarr = playingState.goals_ht.split("-");
        }
        const allget = Number(goalsarr[0]) > 2 || Number(goalsarr[1]) > 2;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //主客和 & 2.5球大/小
    else if (orderItem.market_type == marketType.MATCH_ODDS_AND_OVER_UNDER_2_5) {
        const goalsarr = playingState.goals_ft.split("-");
        const goals0 = Number(goalsarr[0]);
        const goals1 = Number(goalsarr[1]);
        if (orderItem.s_type == "Home And Over") {
            result_tb.win_type = goals0 > goals1 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Home And Under") {
            result_tb.win_type = goals0 > goals1 && goals0 + goals1 < 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away And Over") {
            result_tb.win_type = goals0 < goals1 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away And Under") {
            result_tb.win_type = goals0 < goals1 && goals0 + goals1 < 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Draw And Over") {
            result_tb.win_type = goals0 == goals1 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Draw And Under") {
            result_tb.win_type = goals0 == goals1 && goals0 + goals1 < 2.5 ? 1 : 4;
        }
    }
    //主客和 & 2.5球大/小 半场
    else if (orderItem.market_type == marketType.MATCH_ODDS_AND_OVER_UNDER_2_5_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const goals0 = Number(goalsarr[0]);
        const goals1 = Number(goalsarr[1]);
        if (orderItem.s_type == "Home And Over") {
            result_tb.win_type = goals0 > goals1 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Home And Under") {
            result_tb.win_type = goals0 > goals1 && goals0 + goals1 < 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away And Over") {
            result_tb.win_type = goals0 < goals1 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away And Under") {
            result_tb.win_type = goals0 < goals1 && goals0 + goals1 < 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Draw And Over") {
            result_tb.win_type = goals0 == goals1 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Draw And Under") {
            result_tb.win_type = goals0 == goals1 && goals0 + goals1 < 2.5 ? 1 : 4;
        }
    }
    //入球单双 & 2.5球大/小
    else if (orderItem.market_type == marketType.ODD_OR_EVEN_AND_OVER_UNDER_2_5) {
        const goalsarr = playingState.goals_ft.split("-");
        const goals0 = Number(goalsarr[0]);
        const goals1 = Number(goalsarr[1]);
        if (orderItem.s_type == "Odd And Over") {
            result_tb.win_type = (goals0 + goals1) % 2 == 1 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Odd And Under") {
            result_tb.win_type = (goals0 + goals1) % 2 == 1 && goals0 + goals1 < 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Even And Over") {
            result_tb.win_type = (goals0 + goals1) % 2 == 0 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Even And Under") {
            result_tb.win_type = (goals0 + goals1) % 2 == 0 && goals0 + goals1 < 2.5 ? 1 : 4;
        }
    }
    //入球单双 & 2.5球大/小 半场
    else if (orderItem.market_type == marketType.ODD_OR_EVEN_AND_OVER_UNDER_2_5_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const goals0 = Number(goalsarr[0]);
        const goals1 = Number(goalsarr[1]);
        if (orderItem.s_type == "Odd And Over") {
            result_tb.win_type = (goals0 + goals1) % 2 == 1 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Odd And Under") {
            result_tb.win_type = (goals0 + goals1) % 2 == 1 && goals0 + goals1 < 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Even And Over") {
            result_tb.win_type = (goals0 + goals1) % 2 == 0 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Even And Under") {
            result_tb.win_type = (goals0 + goals1) % 2 == 0 && goals0 + goals1 < 2.5 ? 1 : 4;
        }
    }
    //主客和 & 两队都得分
    else if (orderItem.market_type == marketType.MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE) {
        const goalsarr = playingState.goals_ft.split("-");
        const goals0 = Number(goalsarr[0]);
        const goals1 = Number(goalsarr[1]);
        if (orderItem.s_type == "Home And Yes") {
            result_tb.win_type = goals0 > goals1 && goals0 > 0 && goals1 > 0 ? 1 : 4;
        } else if (orderItem.s_type == "Home And No") {
            result_tb.win_type = goals0 > goals1 && !(goals0 > 0 && goals1 > 0) ? 1 : 4;
        } else if (orderItem.s_type == "Away And Yes") {
            result_tb.win_type = goals0 < goals1 && goals0 > 0 && goals1 > 0 ? 1 : 4;
        } else if (orderItem.s_type == "Away And No") {
            result_tb.win_type = goals0 < goals1 && !(goals0 > 0 && goals1 > 0) ? 1 : 4;
        } else if (orderItem.s_type == "Draw And Yes") {
            result_tb.win_type = goals0 == goals1 && goals0 > 0 && goals1 > 0 ? 1 : 4;
        } else if (orderItem.s_type == "Draw And No") {
            result_tb.win_type = goals0 == goals1 && !(goals0 > 0 && goals1 > 0) ? 1 : 4;
        }
    }
    //主客和 & 两队都得分 半场
    else if (orderItem.market_type == marketType.MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const goals0 = Number(goalsarr[0]);
        const goals1 = Number(goalsarr[1]);
        if (orderItem.s_type == "Home And Yes") {
            result_tb.win_type = goals0 > goals1 && goals0 > 0 && goals1 > 0 ? 1 : 4;
        } else if (orderItem.s_type == "Home And No") {
            result_tb.win_type = goals0 > goals1 && !(goals0 > 0 && goals1 > 0) ? 1 : 4;
        } else if (orderItem.s_type == "Away And Yes") {
            result_tb.win_type = goals0 < goals1 && goals0 > 0 && goals1 > 0 ? 1 : 4;
        } else if (orderItem.s_type == "Away And No") {
            result_tb.win_type = goals0 < goals1 && !(goals0 > 0 && goals1 > 0) ? 1 : 4;
        } else if (orderItem.s_type == "Draw And Yes") {
            result_tb.win_type = goals0 == goals1 && goals0 > 0 && goals1 > 0 ? 1 : 4;
        } else if (orderItem.s_type == "Draw And No") {
            result_tb.win_type = goals0 == goals1 && !(goals0 > 0 && goals1 > 0) ? 1 : 4;
        }
    }
    //两队都得分 & 2.5球大/小
    else if (orderItem.market_type == marketType.BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2_5) {
        const goalsarr = playingState.goals_ft.split("-");
        const goals0 = Number(goalsarr[0]);
        const goals1 = Number(goalsarr[1]);
        if (orderItem.s_type == "Yes And Over") {
            result_tb.win_type = goals0 > 0 && goals1 > 0 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Yes And Under") {
            result_tb.win_type = goals0 > 0 && goals1 > 0 && goals0 + goals1 < 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "No And Over") {
            result_tb.win_type = !(goals0 > 0 && goals1 > 0) && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "No And Under") {
            result_tb.win_type = !(goals0 > 0 && goals1 > 0) && goals0 + goals1 < 2.5 ? 1 : 4;
        }
    }
    //两队都得分 & 2.5球大/小 半场
    else if (orderItem.market_type == marketType.BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2_5_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const goals0 = Number(goalsarr[0]);
        const goals1 = Number(goalsarr[1]);
        if (orderItem.s_type == "Yes And Over") {
            result_tb.win_type = goals0 > 0 && goals1 > 0 && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "Yes And Under") {
            result_tb.win_type = goals0 > 0 && goals1 > 0 && goals0 + goals1 < 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "No And Over") {
            result_tb.win_type = !(goals0 > 0 && goals1 > 0) && goals0 + goals1 > 2.5 ? 1 : 4;
        } else if (orderItem.s_type == "No And Under") {
            result_tb.win_type = !(goals0 > 0 && goals1 > 0) && goals0 + goals1 < 2.5 ? 1 : 4;
        }
    }
    //两队都得分 & 任意一队得两分或以上
    else if (orderItem.market_type == marketType.BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2_5) {
        const goalsarr = playingState.goals_ft.split("-");
        const goals0 = Number(goalsarr[0]);
        const goals1 = Number(goalsarr[1]);
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = goals0 > 0 && goals1 > 0 && (goals0 > 1 || goals1 > 1) ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = !(goals0 > 0 && goals1 > 0) && goals0 + goals1 < 2.5 ? 1 : 4;
        }
    }
    //两队都得分 & 任意一队得两分或以上 半场
    else if (orderItem.market_type == marketType.BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2_5) {
        const goalsarr = playingState.goals_ht.split("-");
        const goals0 = Number(goalsarr[0]);
        const goals1 = Number(goalsarr[1]);
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = goals0 > 0 && goals1 > 0 && (goals0 > 1 || goals1 > 1) ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = !(goals0 > 0 && goals1 > 0) && goals0 + goals1 < 2.5 ? 1 : 4;
        }
    }
    //亚洲让分盘 - 罚牌数
    else if (orderItem.market_type == marketType.BK_ASIAN_HANDICAP) {
        //主队罚牌分
        const goals0 = parseInt(playingState.yellow_cards_ft.split("-")[0]) + 2 * parseInt(playingState.red_cards_ft.split("-")[0]);
        const goals1 = parseInt(playingState.yellow_cards_ft.split("-")[1]) + 2 * parseInt(playingState.red_cards_ft.split("-")[1]);

        if (orderItem.s_type == "Home") {
            const score = handicap + goals0 - goals1;
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goals0 - (handicap + goals1);
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //亚洲让分盘 - 罚牌数 - 半场
    else if (orderItem.market_type == marketType.BK_ASIAN_HANDICAP_HALF_TIME) {
        //主队罚牌分
        const goals0 = parseInt(playingState.yellow_cards_ht.split("-")[0]) + 2 * parseInt(playingState.red_cards_ht.split("-")[0]);
        const goals1 = parseInt(playingState.yellow_cards_ht.split("-")[1]) + 2 * parseInt(playingState.red_cards_ht.split("-")[1]);

        if (orderItem.s_type == "Home") {
            const score = handicap + goals0 - goals1;
            result_tb.win_type = score == 0 ? 3 : score == 0.25 ? 2 : score == -0.25 ? 5 : score >= 0.5 ? 1 : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goals0 - (handicap + goals1);
            result_tb.win_type = score == 0 ? 3 : score == -0.25 ? 2 : score == 0.25 ? 5 : score <= -0.5 ? 1 : 4;
        }
    }
    //亚洲大小盘 - 罚牌数
    else if (orderItem.market_type == marketType.BK_ASIAN_OVER_UNDER) {
        //主队罚牌分
        const goals0 = parseInt(playingState.yellow_cards_ft.split("-")[0]) + 2 * parseInt(playingState.red_cards_ft.split("-")[0]);
        const goals1 = parseInt(playingState.yellow_cards_ft.split("-")[1]) + 2 * parseInt(playingState.red_cards_ft.split("-")[1]);
        const allscore = goals0 + goals1;
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }
    //半场 - 亚洲大小盘 - 罚牌数
    else if (orderItem.market_type == marketType.BK_ASIAN_OVER_UNDER_HALF_TIME) {
        const goals0 = parseInt(playingState.yellow_cards_ht.split("-")[0]) + 2 * parseInt(playingState.red_cards_ht.split("-")[0]);
        const goals1 = parseInt(playingState.yellow_cards_ht.split("-")[1]) + 2 * parseInt(playingState.red_cards_ht.split("-")[1]);
        const allscore = goals0 + goals1;
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type = offset == 0 ? 3 : offset == 0.25 ? 2 : offset <= 0.5 ? 1 : offset >= -0.5 ? 4 : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type = offset == 0 ? 3 : offset == -0.25 ? 2 : offset >= 0.5 ? 1 : offset <= -0.5 ? 4 : 5;
        }
    }

    result_tb.heardstr = "";
    if (result_tb.win_type == 1) {
        result_tb.win_num = "+" + Number(orderItem.expected_win);
        result_tb.heardstr = "+";
    } else if (result_tb.win_type == 2) {
        result_tb.win_num = "+" + Number(orderItem.expected_win) / 2;
        result_tb.heardstr = "+";
    } else if (result_tb.win_type == 3) {
        result_tb.win_num = 0;
    } else if (result_tb.win_type == 4) {
        result_tb.win_num = "-" + Number(orderItem.stake);
        result_tb.heardstr = "-";
    } else if (result_tb.win_type == 5) {
        result_tb.win_num = "-" + Number(orderItem.stake) / 2;
        result_tb.heardstr = "-";
    }
    return result_tb;
}
const exportOrder = {
    getOrderTitle,
    getNameByeSelectionType,
    getTeamName,
    IsOnlyFirstHalf,
    getScoreStr,
    advance_result,
};

export default exportOrder;
