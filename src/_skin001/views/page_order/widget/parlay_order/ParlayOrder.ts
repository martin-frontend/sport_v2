import AbstractView from "@/core/abstract/AbstractView";
import { Prop } from "vue-property-decorator";
import PageOrderProxy from "../../proxy/PageOrderProxy";
import LangUtil from "@/core/global/LangUtil";
import { amountFormat, dateFormat, getDateByTimeZone, TransMarketPrice } from "@/core/global/Functions";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import GlobalVar from "@/core/global/GlobalVar";
export default class ParlayOrder extends AbstractView {
    @Prop() item!: any;

    isShowCompetition = false;
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
        3: "#FF2828", //拒绝
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

    destroyed() {
        super.destroyed();
    }
    transTitle(title: any, idx: any) {
        const matches = this.pageData.list[idx];
        const homestr = LangUtil("主队").trim();
        const awaystr = LangUtil("客队").trim();
        const { home_name, away_name } = matches;
        title = title.replace(new RegExp(homestr, "ig"), home_name).replace(new RegExp(awaystr, "ig"), away_name);
        return title;
    }
    getDisplayResult(item: any) {
        const itemState = this.pageData.states.find((tempitem: any) => item.event_id == tempitem.event_id);
        if (itemState) {
            const result_tb = OrderTitleUtils.advance_result(item, itemState);
            if (result_tb.win_type == 0) {
                //没找到预算的盘口 按照预计输赢显示
                return {
                    str: GlobalVar.currency + " " + amountFormat(item.expected_win, true, 2),
                    color: this.$vuetify.theme.dark ? "#1B5FFF" : "#0325b4",
                };
            }
            return {
                str:
                    GlobalVar.currency +
                    " " +
                    amountFormat(result_tb.win_num, true, 2, result_tb.heardstr) +
                    "(" +
                    this.getWinTypeStr({ win_type: result_tb.win_type }) +
                    ")",
                color: this.resultMapColor[result_tb.win_type],
            };
        } else {
            return {
                str: GlobalVar.currency + " " + amountFormat(item.expected_win, true, 2),
                color: this.$vuetify.theme.dark ? "#1B5FFF" : "#0325b4",
            };
        }
    }

    // get parlayOdds() {
    //     let odds = 1;
    //     this.item.leg_info.forEach((item: any) => {
    //         odds *= this.TransMarketPrice(item.odds);
    //     });
    //     return odds.toFixed(2);
    // }
}