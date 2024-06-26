import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import historyResultMediator from "../mediator/historyResultMediator";
import historyResultProxy from "../proxy/historyResultProxy";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import { getQueryVariable, getTodayOffset } from "@/core/global/Functions";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import { getResponseIcon, amountFormat, dateFormat, TransMarketPrice, getDateByTimeZone } from "@/core/global/Functions";
import CopyUtil from "@/core/global/CopyUtil";
import EnumMarketType from "@/core/global/MarketUtils";
import SportUtil from "@/core/global/SportUtil";
import Assets from "@/_skin001/assets/Assets";
@Component
export default class PageOrderDetail extends AbstractView {
    LangUtil = LangUtil;
    dateFormat = dateFormat;
    amountFormat = amountFormat;
    getDateByTimeZone = getDateByTimeZone;
    getResponseIcon = getResponseIcon;
    TransMarketPrice = TransMarketPrice;

    OrderTitleUtils = OrderTitleUtils;
    myProxy: historyResultProxy = getProxy(historyResultProxy);
    pageData = this.myProxy.pageData;
    listQuery = this.myProxy.listQuery;

    GlobalVar = GlobalVar;
    bShowDateSelect = false;
    form = {
        lang: getQueryVariable("lang") || "zh_CN",
        order_id: getQueryVariable("order_id"),
        plat_id: getQueryVariable("plat_id"),
        timezone: getQueryVariable("timezone"),
        sign: getQueryVariable("sign"),
        token: getQueryVariable("t") || "",
    };
    sportIcon = Assets.SportIcon;
    isRaceEvent = SportUtil.isRaceEvent;
    constructor() {
        super(historyResultMediator);
    }
    // 注单状态
    get statusMap() {
        return {
            0: LangUtil("确认中"), //确认中
            1: LangUtil("确认成功"), //确认成功
            3: LangUtil("已拒绝"), //拒绝
            4: LangUtil("已取消"), //拒绝
            5: LangUtil("无效"), //无效
            8: LangUtil("准异常"), //准异常
        };
    }
    //根据盘口展示已结算的赛果角球还是比分等
    getHadResultStr(item: any) {
        const copyitem = JSON.parse(JSON.stringify(item));
        copyitem.state = copyitem.settle_state;

        return OrderTitleUtils.getScoreStr(copyitem);
    }
    mounted() {
        this.myProxy.api_public_plat_config();
        console.log("server_time", GlobalVar.server_time);
    }
    // transTitle(title: any, idx: any) {
    //     const matches = this.pageData.list[idx];
    //     const homestr = LangUtil("主队").trim();
    //     const awaystr = LangUtil("客队").trim();
    //     const { home_name, away_name } = matches;
    //     title = title.replace(new RegExp(homestr, "ig"), home_name).replace(new RegExp(awaystr, "ig"), away_name);
    //     return title;
    // }
    pageLoad() {
        this.listQuery.page_count++;
        // this.myProxy.api_user_orders();
        this.myProxy.api_user_orders_v3();
    }
    transTime(_t: any) {
        return dateFormat(getDateByTimeZone(_t * 1000, GlobalVar.zone), "hh:mm:ss");
    }
    //今日 昨日 7天 30天
    onLimitOrder(type: any) {
        this.pageData.isActive = type;
        this.myProxy.get_order_by_limit(type);
        // this.onWatchselectDate();
    }
    onSelectDate() {
        this.bShowDateSelect = false;
        this.pageData.isActive = 1000;
        this.myProxy.get_order_selectdata(this.myProxy.selectDate);
    }
    onSportChange() {
        this.myProxy.listQuery.page_count = 1;
        this.pageData.list = [];
        this.myProxy.api_user_orders_v3();
    }

    formatDate(date: any) {
        if (!date) return null;

        const [year, month, day] = date.split("-");
        if (year && month && day) {
            return `${year}/${month}/${day}`;
        } else {
            return date;
        }
    }

    onfresh() {
        if (!this.myProxy.selectDate || !this.myProxy.selectDate[0] || !this.myProxy.selectDate[1]) {
            return;
        }
        this.myProxy.listQuery.page_count = 1;
        this.pageData.list = [];
        this.myProxy.get_order_selectdata(this.myProxy.selectDate);
    }
    onCopyOrder(order: any) {
        CopyUtil(order);
        this.$notify({
            group: "message",
            title: LangUtil("复制成功"),
        });
    }
    getResultStr(win: any) {
        if (win == 0) {
            return LangUtil("平手");
        } else if (win > 0) {
            return LangUtil("赢");
        } else {
            return LangUtil("输");
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
            case 6:
                return LangUtil("提前结算");
        }
    }

    getWinTypeColor(item: any) {
        switch (item.win_type) {
            case 1:
                return "green";
            case 2:
                return "purple";
            case 3:
                return "yellow";
            case 4:
                return "red";
            case 5:
                return "blue";
            case 6:
                return "orange";
        }
    }

    getMultiWinTypeStr(item: any) {
        switch (item.selection_win_type) {
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
            case 7:
                return LangUtil("失效");
        }
    }

    getMultiWinTypeColor(item: any) {
        switch (item.selection_win_type) {
            case 1:
                return "green";
            case 2:
                return "purple";
            case 3:
                return "yellow";
            case 4:
                return "red";
            case 5:
                return "blue";
            case 7:
                return "#a2a2a2";
        }
    }

    onTimeChange() {
        console.log("-time change", this.myProxy.selectDate);
        if (!this.myProxy.selectDate) {
            this.myProxy.selectDate = ["", ""];
        }
        let startDate = this.myProxy.selectDate[0];
        console.log("--->>>>", startDate);
        let endDate = this.myProxy.selectDate[1];
        if (!startDate) {
            startDate = "";
        }
        if (!endDate) {
            endDate = "";
        }
        if (!startDate || !endDate) {
            this.myProxy.selectDate = [startDate, endDate];
        }
        if (!this.myProxy.selectDate[0] || !this.myProxy.selectDate[1]) return;
        this.myProxy.get_order_selectdata(this.myProxy.selectDate);
        // this.pageData.listQuery.page_count = 1;
        // this.myProxy.getApi();
    }
}
