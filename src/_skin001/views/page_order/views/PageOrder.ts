import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageOrderMediator from "../mediator/PageOrderMediator";
import PageOrderProxy from "../proxy/PageOrderProxy";
import LangUtil from "@/core/global/LangUtil";
import { amountFormat, dateFormat, getDateByTimeZone, TransMarketPrice } from "@/core/global/Functions";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import GlobalVar from "@/core/global/GlobalVar";
import EnumMarketType from "@/core/global/MarketUtils";
const marketType = EnumMarketType.EnumMarketType;

@Component
export default class PageOrder extends AbstractView {
    LangUtil = LangUtil;
    dateFormat = dateFormat;
    getDateByTimeZone = getDateByTimeZone;
    amountFormat = amountFormat;
    TransMarketPrice = TransMarketPrice;
    OrderTitleUtils = OrderTitleUtils;
    GlobalVar = GlobalVar;
    myProxy: PageOrderProxy = this.getProxy(PageOrderProxy);
    pageData = this.myProxy.pageData;
    listQuery = this.myProxy.listQuery;

    constructor() {
        super(PageOrderMediator);
    }

    // 注单状态
    statusMap = {
        0: LangUtil("确认中"), //确认中
        1: LangUtil("确认成功"), //确认成功
        3: LangUtil("已拒绝"), //拒绝
        4: LangUtil("已取消"), //拒绝
        5: LangUtil("无效"), //无效
        8: LangUtil("准异常"), //准异常
    };
    statusMapColor = {
        0: "#FF7128", //确认中
        1: "#007E29", //确认成功
        3: "#7E0000", //拒绝
        4: "#FF2828", //取消
        8: "#FF2828", //准异常
    };
    resultMapColor: any = {
        1: "#138723", //赢
        2: "#138723", //半赢
        3: "#138723", //和
        4: "#ff0f0e", //输
        5: "#ff0f0e", //输一半
    };

    getWinType(item: any) {
        //win_type: 1，赢，2 半赢，3 平手，4，输，5 输一半
        switch (item.win_type) {
            case 1:
                return require(`@/_skin001/assets/win_type/win.png`);
            case 2:
                return require(`@/_skin001/assets/win_type/halfwin.png`);
            case 3:
                return require(`@/_skin001/assets/win_type/draw.png`);
            case 4:
                return require(`@/_skin001/assets/win_type/lose.png`);
            case 5:
                return require(`@/_skin001/assets/win_type/halflose.png`);
        }
    }
    getWinTypeStr(item: any) {
        switch (item.win_type) {
            case 1:
                return LangUtil("赢");
            case 2:
                return LangUtil("半赢");
            case 3:
                return LangUtil("平手");
            case 4:
                return LangUtil("输");
            case 5:
                return LangUtil("输一半");
        }
    }
    //根据盘口展示已结算的赛果角球还是比分等
    getHadResultStr(item: any) {
        const copyitem = JSON.parse(JSON.stringify(item));
        copyitem.state = copyitem.real_time_state;

        return OrderTitleUtils.getScoreStr(copyitem);
    }

    getStateStr(item: any) {
        if (this.listQuery.is_settle == 1) {
            return "";
        }
        const result_tb = <any>{ states_str: "", scoreStr: "" };
        let states_str = "";
        const state = item.playingstate || item.state;
        if (state && Object.keys(state).length > 0) {
            const market_type = item.market_type;
            const copyitem = JSON.parse(JSON.stringify(item));
            copyitem.state = state;
            if (OrderTitleUtils.IsOnlyFirstHalf(market_type) && state.match_phase != "1H" && state.match_phase != "-") {
                //
                //上半场已经结束
                result_tb.states_str = LangUtil("上半场已结束");
                result_tb.scoreStr = OrderTitleUtils.getScoreStr(copyitem);
                return result_tb;
            }
            if (state.match_phase) {
                states_str += " " + LangUtil(state.match_phase);
            }
            if (state.phase_minute > 0) {
                states_str += " " + state.phase_minute + LangUtil("分钟");
            }
            result_tb.scoreStr = OrderTitleUtils.getScoreStr(copyitem);
        } else {
            const start_in_sec = item.event_time_timestamp - GlobalVar.server_time;
            const day = Math.floor(start_in_sec / 60 / 60 / 24);
            const hr = Math.floor(start_in_sec / 60 / 60);
            const min = Math.floor((start_in_sec / 60) % 60);
            if (start_in_sec > 0) {
                states_str = dateFormat(getDateByTimeZone(item.event_time_timestamp * 1000, GlobalVar.zone), "MM-dd hh:mm");
                if (start_in_sec > 86400) {
                    states_str += " " + LangUtil("距开赛") + " " + day + LangUtil("天");
                } else if (start_in_sec > 600) {
                    states_str += " " + LangUtil("距开赛") + " " + hr + LangUtil("小时") + min + LangUtil("分");
                }
            } else {
                states_str = "";
            }
        }
        result_tb.states_str = states_str;

        return result_tb;
    }

    onTabClick(tabIndex: number) {
        this.listQuery.is_settle = tabIndex;
        this.myProxy.onReset();
        this.myProxy.api_user_orders();
    }

    onBack() {
        this.myProxy.listQuery.is_settle = 0;
        this.$router.back();
        this.myProxy.onReset();
        this.myProxy.listQuery.unique = "settleCount";
        this.myProxy.api_user_orders();
    }
    //pc获取更多
    pageLoad() {
        this.listQuery.page_count++;
        this.myProxy.api_user_orders();
    }

    //重新整理
    onRefresh(done: any) {
        this.myProxy.listRefrush(done);
    }
    // 手机 load more
    onLoad(done: any) {
        this.myProxy.listMore(done);
    }
    //今日 昨日 7天 30天
    onLimitOrder(type: any) {
        console.warn("onLimitOrder: ", type);
        this.pageData.isActive = type;
        this.myProxy.get_order_by_limit(type);
    }

    destroyed() {
        super.destroyed();
    }
    //获取预算文字
    getdisplayResultStr(item: any) {
        const itemState = this.pageData.states.find((tempitem: any) => item.event_id == tempitem.event_id);
        if (itemState) {
            return LangUtil("预计结果");
        } else {
            return LangUtil("预计可赢");
        }
    }
    getDisplayResult(item: any) {
        const itemState = this.pageData.states.find((tempitem: any) => item.event_id == tempitem.event_id);
        if (itemState) {
            const result_tb = this.advance_result(item, itemState);
            if (result_tb.win_type == 0) {
                //没找到预算的盘口 按照预计输赢显示
                return { str: GlobalVar.currency + " " + amountFormat(item.expected_win, true, 3), color: "#0325b4" };
            }
            return {
                str: GlobalVar.currency + " " + result_tb.win_num + "(" + this.getWinTypeStr({ win_type: result_tb.win_type }) + ")",
                color: this.resultMapColor[result_tb.win_type],
            };
        } else {
            return { str: GlobalVar.currency + " " + amountFormat(item.expected_win, true, 3), color: "#0325b4" };
        }
    }
    //预算结果逻辑
    advance_result(orderItem: any, playingState: any) {
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
        else if (orderItem.market_type == marketType.CR_ASIAN_HANDICAP) {
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
            const allstr =
                Number(goalsarr[0]) == Number(goalsarr[1]) ? "Draw" : Number(goalsarr[0]) > Number(goalsarr[1]) ? "Home" : "Away";
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
        if (result_tb.win_type == 1) {
            result_tb.win_num = "+" + Number(orderItem.expected_win);
        } else if (result_tb.win_type == 2) {
            result_tb.win_num = "+" + Number(orderItem.expected_win) / 2;
        } else if (result_tb.win_type == 3) {
            result_tb.win_num = 0;
        } else if (result_tb.win_type == 4) {
            result_tb.win_num = -Number(orderItem.stake);
        } else if (result_tb.win_type == 5) {
            result_tb.win_num = -Number(orderItem.stake) / 2;
        }
        return result_tb;
    }
}
