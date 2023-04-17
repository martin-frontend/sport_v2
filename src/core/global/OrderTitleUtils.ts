import EnumMarketType from "@/core/global/MarketUtils";
import LangUtil from "./LangUtil";
const marketType = EnumMarketType.EnumMarketType;
const formatAsian = EnumMarketType.formatAsian;

function getNameByeSelectionType(
    s_type: string,
    home_name: string,
    away_name: string
) {
    if (s_type == "Home-Draw")
        return `${LangUtil(`${home_name}`)}-${LangUtil("和")}`;
    if (s_type == "Away-Draw")
        return `${LangUtil(`${away_name}`)}-${LangUtil("和")}`;
    if (s_type == "Home-Home")
        return `${LangUtil(`${home_name}`)}-${LangUtil(`${home_name}`)}`;
    if (s_type == "Home-Away")
        return `${LangUtil(`${home_name}`)}-${LangUtil(`${away_name}`)}`;
    if (s_type == "Away-Away")
        return `${LangUtil(`${away_name}`)}-${LangUtil(`${away_name}`)}`;
    if (s_type == "Away-Home")
        return `${LangUtil(`${away_name}`)}-${LangUtil(`${home_name}`)}`;
    if (s_type == "Draw-Home")
        return `${LangUtil("和")}-${LangUtil(`${home_name}`)}`;
    if (s_type == "Draw-Draw") return `${LangUtil("和")}-${LangUtil("和")}`;
    if (s_type == "Draw-Away")
        return `${LangUtil("和")}-${LangUtil(`${away_name}`)}`;
}
function getOrderTitle(
    { market_type, s_type, home_name, away_name, content, side, handicap }: any,
    onOrder: boolean = false
) {
    switch (market_type) {
        case marketType.MATCH_ODDS: //主客和
        case marketType.MATCH_ODDS_HALF_TIME: //半场 - 主客和
            return s_type == "Home"
                ? home_name
                : s_type == "Away"
                ? away_name
                : LangUtil("Draw");
        case marketType.TOTAL_GOALS: //总入球
        case marketType.TOTAL_GOALS_HALF_TIME: //半场 - 总入球
        case marketType.ASIAN_OVER_UNDER: //亚洲大小盘
        case marketType.ASIAN_OVER_UNDER_HALF_TIME: //半场 - 亚洲大小盘
        case marketType.CR_ASIAN_OVER_UNDER:
        case marketType.ASIAN_OVER_UNDER_EXTRA_TIME:
        case marketType.ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME:
        case marketType.ASIAN_OVER_UNDER_AFTER_PENALTIES:
            return `${
                s_type == "Overs" ? LangUtil("大") : LangUtil("小")
            } ${formatAsian(handicap, s_type).substring(1)}`;
        case marketType.ASIAN_HANDICAP: //亚洲让球盘
        case marketType.ASIAN_HANDICAP_HALF_TIME: //半场 - 亚洲让球盘
        case marketType.DRAW_NO_BET: //平局退款
        case marketType.DRAW_NO_BET_HALF_TIME: //半场-平局退款
        case marketType.CR_ASIAN_HANDICAP:
        case marketType.ASIAN_HANDICAP_EXTRA_TIME:
        case marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME:
        case marketType.ASIAN_HANDICAP_AFTER_PENALTIES:
            return `${s_type == "Home" ? home_name : away_name} ${formatAsian(
                handicap,
                s_type
            )}`;
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
            return `${
                s_type == "Yes" ? LangUtil("是") : LangUtil("否")
            } ${formatAsian(handicap, s_type)}`;
        case marketType.ODD_OR_EVEN_HALF_TIME: //半场 - 单/双
        case marketType.ODD_OR_EVEN: //入球单双
        case marketType.TEAM_A_GOALS_ODD_OR_EVEN:
        case marketType.TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME:
        case marketType.TEAM_B_GOALS_ODD_OR_EVEN:
        case marketType.TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME:
            return `${
                s_type == "Odd" ? LangUtil("单") : LangUtil("双")
            } ${formatAsian(handicap, s_type)}`;
        case marketType.CORRECT_SCORE: //'波胆'
        case marketType.CORRECT_SCORE_HALF_TIME: //半场 - 波胆
            return s_type == "" ? LangUtil("其它") : s_type;
    }
}
//special > 注单记录 双重机会/双胜彩
function getTeamName(data: any, special: boolean = true) {
    const teamType = ["Home", "Away", "Draw"];
    const marketType = [
        "HALF_TIME_FULL_TIME",
        "DOUBLE_CHANCE",
        "DOUBLE_CHANCE_HALF_TIME",
    ];
    const notMarketType = ["DRAW_NO_BET", "DRAW_NO_BET_HALF_TIME"];
    if (special) {
        if (
            teamType.includes(data.selection.type) &&
            !notMarketType.includes(data.market.market_type)
        ) {
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
            ? getNameByeSelectionType(
                  data.selection.type,
                  data.matche.home_team,
                  data.matche.away_team
              )
            : "";
    } else {
        return marketType.includes(data.market_type)
            ? getNameByeSelectionType(
                  data.s_type,
                  data.home_name,
                  data.away_name
              )
            : "";
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
        marketType.CR_ASIAN_OVER_UNDER,
    ]; //角球
    const addtimeHalfMarket_type = [
        marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME,
        marketType.ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME,
    ]; //半场加时
    const addtimeMarket_type = [
        marketType.ASIAN_HANDICAP_EXTRA_TIME,
        marketType.ASIAN_OVER_UNDER_EXTRA_TIME,
    ]; //全场加时
    const AFTER_Market_type = [
        marketType.ASIAN_HANDICAP_AFTER_PENALTIES,
        marketType.ASIAN_OVER_UNDER_AFTER_PENALTIES,
    ]; //点球
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
    ];
    const state =
        Object.keys(item.state || {}).length > 0
            ? item.state
            : item.real_time_state
            ? item.real_time_state
            : item.state;
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
    } else {
        if (!state.goals_ft) return "";
        return " " + LangUtil("比分") + "(" + state.goals_ft + ")";
    }
}
//预算结果逻辑
function advance_result(orderItem: any, playingState: any) {
    //1赢 2半赢 3平 4输 5输一半
    const result_tb = <any>{ win_type: 0, win_num: 0 };
    let handicap = orderItem.handicap;
    handicap = Number(handicap);

    //是否是滚球
    const isPlaying = Object.keys(orderItem.state).length > 0;
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
            const score =
                handicap +
                (goalsarr[0] - betgoalsarr[0]) -
                (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score =
                goalsarr[0] -
                betgoalsarr[0] -
                (handicap + (goalsarr[1] - betgoalsarr[1]));
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
        }
    }
    //滚球中的半场-亚洲让球
    else if (
        orderItem.market_type == marketType.ASIAN_HANDICAP_HALF_TIME &&
        isPlaying
    ) {
        const goalsarr = playingState.goals_ht.split("-"); //事实的比分 0-2
        const betgoalsarr = orderItem.state.goals_ht.split("-"); //快照时候的比分 0-1
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        betgoalsarr[0] = Number(betgoalsarr[0]);
        betgoalsarr[1] = Number(betgoalsarr[1]);

        if (orderItem.s_type == "Home") {
            const score =
                handicap +
                (goalsarr[0] - betgoalsarr[0]) -
                (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score =
                goalsarr[0] -
                betgoalsarr[0] -
                (handicap + (goalsarr[1] - betgoalsarr[1]));
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
        }
    }
    //滚球中的亚洲让球盘-角球
    else if (
        orderItem.market_type == marketType.CR_ASIAN_HANDICAP &&
        isPlaying
    ) {
        const goalsarr = playingState.corners_ft.split("-"); //事实的比分
        const betgoalsarr = orderItem.state.corners_ft.split("-"); //快照时候的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        betgoalsarr[0] = Number(betgoalsarr[0]);
        betgoalsarr[1] = Number(betgoalsarr[1]);

        if (orderItem.s_type == "Home") {
            const score =
                handicap +
                (goalsarr[0] - betgoalsarr[0]) -
                (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score =
                goalsarr[0] -
                betgoalsarr[0] -
                (handicap + (goalsarr[0] - betgoalsarr[1]));
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
        }
    }
    //亚洲让球盘
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP) {
        const goalsarr = playingState.goals_ft.split("-");
        if (orderItem.s_type == "Home") {
            const score = handicap + Number(goalsarr[0]) - Number(goalsarr[1]);
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score =
                Number(goalsarr[0]) - (handicap + Number(goalsarr[1]));
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
        }
    }

    //半场-亚洲让球
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        if (orderItem.s_type == "Home") {
            const score = handicap + Number(goalsarr[0]) - Number(goalsarr[1]);
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score =
                Number(goalsarr[0]) - (handicap + Number(goalsarr[1]));
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
        }
    }
    //亚洲让球盘-角球
    else if (orderItem.market_type == marketType.CR_ASIAN_HANDICAP) {
        const goalsarr = playingState.corners_ft.split("-");
        if (orderItem.s_type == "Home") {
            const score = handicap + Number(goalsarr[0]) - Number(goalsarr[1]);
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score =
                Number(goalsarr[0]) - (handicap + Number(goalsarr[1]));
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
        }
    }
    //双重机会/双胜彩
    else if (orderItem.market_type == marketType.DOUBLE_CHANCE) {
        const goalsarr = playingState.goals_ft.split("-");
        const differ = Number(goalsarr[0]) - Number(goalsarr[1]);
        const myBet = orderItem.s_type.split("-");
        const differscore = differ >= 1 ? 1 : differ <= -1 ? -1 : 0;
        const diffstr =
            differscore == 0 ? "Draw" : differscore == 1 ? "Home" : "Away";
        result_tb.win_type = myBet[0] == diffstr || myBet[1] == diffstr ? 1 : 4;
    }
    // 半场-双重机会/双胜彩
    else if (orderItem.market_type == marketType.DOUBLE_CHANCE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const differ = Number(goalsarr[0]) - Number(goalsarr[1]);
        const myBet = orderItem.s_type.split("-");
        const differscore = differ >= 1 ? 1 : differ <= -1 ? -1 : 0;
        const diffstr =
            differscore == 0 ? "Draw" : differscore == 1 ? "Home" : "Away";
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
    else if (
        orderItem.market_type == marketType.BOTH_TEAMS_TO_SCORE_HALF_TIME
    ) {
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
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == 0.25
                    ? 2
                    : offset <= 0.5
                    ? 1
                    : offset >= -0.5
                    ? 4
                    : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == -0.25
                    ? 2
                    : offset >= 0.5
                    ? 1
                    : offset <= -0.5
                    ? 4
                    : 5;
        }
    }
    //半场-亚洲大小盘
    else if (orderItem.market_type == marketType.ASIAN_OVER_UNDER_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == 0.25
                    ? 2
                    : offset <= 0.5
                    ? 1
                    : offset >= -0.5
                    ? 4
                    : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == -0.25
                    ? 2
                    : offset >= 0.5
                    ? 1
                    : offset <= -0.5
                    ? 4
                    : 5;
        }
    }
    //亚洲大小盘-半场加时
    else if (
        orderItem.market_type ==
        marketType.ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME
    ) {
        const goalsarr = playingState.goals_otht.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == 0.25
                    ? 2
                    : offset <= 0.5
                    ? 1
                    : offset >= -0.5
                    ? 4
                    : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == -0.25
                    ? 2
                    : offset >= 0.5
                    ? 1
                    : offset <= -0.5
                    ? 4
                    : 5;
        }
    }
    //亚洲大小盘-加时
    else if (orderItem.market_type == marketType.ASIAN_OVER_UNDER_EXTRA_TIME) {
        const goalsarr = playingState.goals_ot.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == 0.25
                    ? 2
                    : offset <= 0.5
                    ? 1
                    : offset >= -0.5
                    ? 4
                    : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == -0.25
                    ? 2
                    : offset >= 0.5
                    ? 1
                    : offset <= -0.5
                    ? 4
                    : 5;
        }
    }
    //亚洲大小盘-点球
    else if (
        orderItem.market_type == marketType.ASIAN_OVER_UNDER_AFTER_PENALTIES
    ) {
        const goalsarr = playingState.goals_pk.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == 0.25
                    ? 2
                    : offset <= 0.5
                    ? 1
                    : offset >= -0.5
                    ? 4
                    : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == -0.25
                    ? 2
                    : offset >= 0.5
                    ? 1
                    : offset <= -0.5
                    ? 4
                    : 5;
        }
    }
    //亚洲让球-点球
    else if (
        orderItem.market_type == marketType.ASIAN_HANDICAP_AFTER_PENALTIES
    ) {
        const goalsarr = playingState.goals_pk.split("-"); //事实的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        if (orderItem.s_type == "Home") {
            const score = handicap + goalsarr[0] - goalsarr[1];
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - (handicap + goalsarr[1]);
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
        }
    }
    //总入球
    else if (orderItem.market_type == marketType.TOTAL_GOALS) {
        const goalsarr = playingState.goals_ft.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == 0.25
                    ? 2
                    : offset <= 0.5
                    ? 1
                    : offset >= -0.5
                    ? 4
                    : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == -0.25
                    ? 2
                    : offset >= 0.5
                    ? 1
                    : offset <= -0.5
                    ? 4
                    : 5;
        }
    }
    //半场-总入球
    else if (orderItem.market_type == marketType.TOTAL_GOALS_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == 0.25
                    ? 2
                    : offset <= 0.5
                    ? 1
                    : offset >= -0.5
                    ? 4
                    : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == -0.25
                    ? 2
                    : offset >= 0.5
                    ? 1
                    : offset <= -0.5
                    ? 4
                    : 5;
        }
    }
    //亚洲大小盘-角球
    else if (orderItem.market_type == marketType.CR_ASIAN_OVER_UNDER) {
        const goalsarr = playingState.corners_ft.split("-");
        const allscore = Number(goalsarr[0]) + Number(goalsarr[1]);
        const offset = allscore - handicap;
        if (orderItem.s_type == "Unders") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == 0.25
                    ? 2
                    : offset <= 0.5
                    ? 1
                    : offset >= -0.5
                    ? 4
                    : 5;
        } else if (orderItem.s_type == "Overs") {
            result_tb.win_type =
                offset == 0
                    ? 3
                    : offset == -0.25
                    ? 2
                    : offset >= 0.5
                    ? 1
                    : offset <= -0.5
                    ? 4
                    : 5;
        }
    }
    //主队零失球获胜
    else if (orderItem.market_type == marketType.TEAM_A_WIN_TO_NIL) {
        const goalsarr = playingState.goals_ft.split("-");
        if (orderItem.s_type == "Yes") {
            result_tb.win_type =
                Number(goalsarr[1]) > 0 || Number(goalsarr[0]) == 0 ? 4 : 1;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type =
                Number(goalsarr[1]) > 0 || Number(goalsarr[0]) == 0 ? 1 : 4;
        }
    }
    //半场 - 主队零失球获胜
    else if (orderItem.market_type == marketType.TEAM_A_WIN_TO_NIL_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        if (orderItem.s_type == "Yes") {
            result_tb.win_type =
                Number(goalsarr[1]) > 0 || Number(goalsarr[0]) == 0 ? 4 : 1;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type =
                Number(goalsarr[1]) > 0 || Number(goalsarr[0]) == 0 ? 1 : 4;
        }
    }
    //客队零失球获胜
    else if (orderItem.market_type == marketType.TEAM_B_WIN_TO_NIL) {
        const goalsarr = playingState.goals_ft.split("-");
        if (orderItem.s_type == "Yes") {
            result_tb.win_type =
                Number(goalsarr[0]) > 0 || Number(goalsarr[1]) == 0 ? 4 : 1;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type =
                Number(goalsarr[0]) > 0 || Number(goalsarr[1]) == 0 ? 1 : 4;
        }
    }
    //半场 - 客队零失球获胜
    else if (orderItem.market_type == marketType.TEAM_B_WIN_TO_NIL_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        if (orderItem.s_type == "Yes") {
            result_tb.win_type =
                Number(goalsarr[0]) > 0 || Number(goalsarr[1]) == 0 ? 4 : 1;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type =
                Number(goalsarr[0]) > 0 || Number(goalsarr[1]) == 0 ? 1 : 4;
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
        result_tb.win_type =
            Number(goalsarr[0]) == Number(mybet[0]) &&
            Number(goalsarr[1]) == Number(mybet[1])
                ? 1
                : 4;
    }
    //半场-波胆
    else if (orderItem.market_type == marketType.CORRECT_SCORE_HALF_TIME) {
        const goalsarr = playingState.goals_ht.split("-");
        const mybet = orderItem.s_type.split("-");
        result_tb.win_type =
            Number(goalsarr[0]) == Number(mybet[0]) &&
            Number(goalsarr[1]) == Number(mybet[1])
                ? 1
                : 4;
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
        const allstr =
            Number(goalsarr[0]) == Number(goalsarr[1])
                ? "Draw"
                : Number(goalsarr[0]) > Number(goalsarr[1])
                ? "Home"
                : "Away";
        const resultstr = halfstr + "-" + allstr;
        result_tb.win_type = orderItem.s_type == resultstr ? 1 : 4;
    }
    //滚球中的亚洲让球盘 半场加时
    else if (
        orderItem.market_type ==
            marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME &&
        isPlaying
    ) {
        const goalsarr = playingState.goals_otht.split("-"); //事实的比分
        const betgoalsarr = orderItem.state.goals_otht.split("-"); //快照时候的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        betgoalsarr[0] = Number(betgoalsarr[0]);
        betgoalsarr[1] = Number(betgoalsarr[1]);

        if (orderItem.s_type == "Home") {
            const score =
                handicap +
                (goalsarr[0] - betgoalsarr[0]) -
                (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score =
                goalsarr[0] -
                betgoalsarr[0] -
                (handicap + (goalsarr[1] - betgoalsarr[1]));
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
        }
    }
    //亚洲让球盘 半场加时
    else if (
        orderItem.market_type == marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME
    ) {
        const goalsarr = playingState.goals_otht.split("-"); //事实的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        if (orderItem.s_type == "Home") {
            const score = handicap + goalsarr[0] - goalsarr[1];
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - (handicap + goalsarr[1]);

            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
        }
    }
    //滚球中的亚洲让球盘 加时
    else if (
        orderItem.market_type == marketType.ASIAN_HANDICAP_EXTRA_TIME &&
        isPlaying
    ) {
        const goalsarr = playingState.goals_ot.split("-"); //事实的比分
        const betgoalsarr = orderItem.state.goals_ot.split("-"); //快照时候的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        betgoalsarr[0] = Number(betgoalsarr[0]);
        betgoalsarr[1] = Number(betgoalsarr[1]);

        if (orderItem.s_type == "Home") {
            const score =
                handicap +
                (goalsarr[0] - betgoalsarr[0]) -
                (goalsarr[1] - betgoalsarr[1]);
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score =
                goalsarr[0] -
                betgoalsarr[0] -
                (handicap + (goalsarr[1] - betgoalsarr[1]));
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
        }
    }
    //亚洲让球盘 加时
    else if (orderItem.market_type == marketType.ASIAN_HANDICAP_EXTRA_TIME) {
        const goalsarr = playingState.goals_ot.split("-"); //事实的比分
        goalsarr[0] = Number(goalsarr[0]);
        goalsarr[1] = Number(goalsarr[1]);
        if (orderItem.s_type == "Home") {
            const score = handicap + goalsarr[0] - goalsarr[1];
            result_tb.win_type =
                score == 0
                    ? 3
                    : score == 0.25
                    ? 2
                    : score == -0.25
                    ? 5
                    : score >= 0.5
                    ? 1
                    : 4;
        } else if (orderItem.s_type == "Away") {
            const score = goalsarr[0] - (handicap + goalsarr[1]);

            result_tb.win_type =
                score == 0
                    ? 3
                    : score == -0.25
                    ? 2
                    : score == 0.25
                    ? 5
                    : score <= -0.5
                    ? 1
                    : 4;
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
    else if (
        orderItem.market_type == marketType.EITHER_TEAM_TO_SCORE_HALF_TIME
    ) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[0]) > 0 || Number(goalsarr[1]) > 0;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //任意一队得两分或以上
    else if (
        orderItem.market_type == marketType.EITHER_TEAM_TO_SCORE_TWICE_OR_MORE
    ) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[0]) > 1 || Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //半场 - 任意一队得分两次或以上
    else if (
        orderItem.market_type ==
        marketType.EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME
    ) {
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
    else if (
        orderItem.market_type == marketType.TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME
    ) {
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
    else if (
        orderItem.market_type == marketType.TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME
    ) {
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
    else if (
        orderItem.market_type == marketType.TEAM_A_TO_SCORE_TWICE_OR_MORE
    ) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[0]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	半场 - 主队得分两次或以上
    else if (
        orderItem.market_type ==
        marketType.TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME
    ) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[0]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	客队得分两次或以上
    else if (
        orderItem.market_type == marketType.TEAM_B_TO_SCORE_TWICE_OR_MORE
    ) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	半场 - 客队得分两次或以上
    else if (
        orderItem.market_type ==
        marketType.TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME
    ) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	两队都得分兩次或以上
    else if (
        orderItem.market_type == marketType.BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE
    ) {
        const goalsarr = playingState.goals_ft.split("-");
        const allget = Number(goalsarr[0]) > 1 && Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
        }
    }
    //	半场 - 两队都得分两次或以上
    else if (
        orderItem.market_type ==
        marketType.BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME
    ) {
        const goalsarr = playingState.goals_ht.split("-");
        const allget = Number(goalsarr[0]) > 1 && Number(goalsarr[1]) > 1;
        if (orderItem.s_type == "Yes") {
            result_tb.win_type = allget ? 1 : 4;
        } else if (orderItem.s_type == "No") {
            result_tb.win_type = allget ? 4 : 1;
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
