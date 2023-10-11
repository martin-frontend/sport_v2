import AbstractView from "@/core/abstract/AbstractView";
import { Prop } from "vue-property-decorator";
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
        7: "#a2a2a2", //void
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

    //根据盘口展示已结算的赛果角球还是比分等
    getHadResultStr(item: any) {
        const copyitem = JSON.parse(JSON.stringify(item));
        copyitem.state = copyitem.real_time_state;

        return OrderTitleUtils.getScoreStr(copyitem);
    }

    // get parlayOdds() {
    //     let odds = 1;
    //     this.item.leg_info.forEach((item: any) => {
    //         odds *= this.TransMarketPrice(item.odds);
    //     });
    //     return odds.toFixed(2);
    // }
}
