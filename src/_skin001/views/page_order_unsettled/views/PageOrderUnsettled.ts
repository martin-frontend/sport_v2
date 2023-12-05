import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageOrderUnsettledMediator from "../mediator/PageOrderUnsettledMediator";
import LangUtil from "@/core/global/LangUtil";
import OrderUnsettledProxy from "@/proxy/OrderUnsettledProxy";
import GlobalVar from "@/core/global/GlobalVar";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import { amountFormat, dateFormat, formatEventTime, getDateByTimeZone, TransMarketPrice } from "@/core/global/Functions";
import CopyUtil from "@/core/global/CopyUtil";
import EnumMarketType from "@/core/global/MarketUtils";
import dialog_confirm_settlement from "@/_skin001/views/dialog_confirm_settlement";

const marketType = EnumMarketType.EnumMarketType;
@Component
export default class PageOrderUnsettled extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    OrderTitleUtils = OrderTitleUtils;
    amountFormat = amountFormat;
    TransMarketPrice = TransMarketPrice;
    dateFormat = dateFormat;
    getDateByTimeZone = getDateByTimeZone;
    myProxy: OrderUnsettledProxy = this.getProxy(OrderUnsettledProxy);
    pageData = this.myProxy.pageData;
    listQuery = this.myProxy.listQuery;
    // isAbleToCashOut = false;
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

    constructor() {
        super(PageOrderUnsettledMediator);
    }

    onCopy(str: string) {
        CopyUtil(str);
        this.$notify({
            group: "message",
            title: LangUtil("复制成功"),
        });
    }

    onMore() {
        this.listQuery.page_count++;
        // this.myProxy.api_user_orders();
        this.myProxy.api_user_orders_v3();
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
            const start_in_sec = item.event_time - GlobalVar.server_time;
            const day = Math.floor(start_in_sec / 60 / 60 / 24);
            const hr = Math.floor(start_in_sec / 60 / 60);
            const min = Math.floor((start_in_sec / 60) % 60);
            if (start_in_sec > 0) {
                states_str = formatEventTime(dateFormat(getDateByTimeZone(item.event_time * 1000, GlobalVar.zone), "yyyy/MM/dd hh:mm:ss", true));
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

    //根据盘口展示已结算的赛果角球还是比分等
    getHadResultStr(item: any) {
        const copyitem = JSON.parse(JSON.stringify(item));
        copyitem.state = copyitem.real_time_state;

        return OrderTitleUtils.getScoreStr(copyitem);
    }

    //获取预算文字
    getdisplayResultStr(item: any) {
        const itemState = Object.keys(item.leg_info[0]?.state).length > 0;
        if (itemState) {
            return LangUtil("当前可赢");
        } else {
            return LangUtil("预计可赢");
        }
    }
    getDisplayResult(item: any) {
        const itemState = this.pageData.states.find((tempitem: any) => item.event_id == tempitem.event_id);
        if (itemState) {
            const result_tb = OrderTitleUtils.advance_result(item, itemState);
            if (result_tb.win_type == 0) {
                //没找到预算的盘口 按照预计输赢显示
                return {
                    str: GlobalVar.currency + " " + amountFormat(item.expected_win, true, 2),
                    color: "#ea7800",
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
                color: "#ea7800",
            };
        }
    }
    // transTitle(title: any) {
    //     const matches = this.pageData.list[0];
    //     const homestr = LangUtil("主队").trim();
    //     const awaystr = LangUtil("客队").trim();
    //     const { home_name, away_name } = matches;
    //     title = title.replace(new RegExp(homestr, "ig"), home_name).replace(new RegExp(awaystr, "ig"), away_name);
    //     return title;
    // }
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

    onQuery() {
        this.myProxy.onReset();
        this.pageData.loading = true;
        this.myProxy.api_user_orders_v3();
    }

    showDialog(item: any) {
        dialog_confirm_settlement.show(item);
    }

    destroyed() {
        super.destroyed();
    }

    getSettlementStr(item: any) {
        switch (item.cash_out_status) {
            case 1:
                return `${LangUtil("提前结算")} ${GlobalVar.currency} ${amountFormat(item.amount)}`;
            case 2:
                return `${LangUtil("申请中")} ${GlobalVar.currency} ${amountFormat(item.amount)}`;
            case 3:
                return `${LangUtil("已接受")} ${GlobalVar.currency} ${amountFormat(item.amount)}`;
            case 4:
                return `${LangUtil("已拒绝")}`;
            case 5:
                return `${LangUtil("兑现完成")}`;
            case 6:
                return `${LangUtil("暂停兑现")}`;
        }
    }
}
