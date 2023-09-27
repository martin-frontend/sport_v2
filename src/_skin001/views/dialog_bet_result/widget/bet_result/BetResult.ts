import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { amountFormat, dateFormat, TransMarketPrice } from "@/core/global/Functions";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import MarketUtils from "@/core/global/MarketUtils";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import BetProxy from "@/proxy/BetProxy";
import MatcheProxy from "@/_skin001/views/matche/proxy/MatcheProxy";
import PageHomeProxy from "@/_skin001/views/page_home/proxy/PageHomeProxy";
import DialogBetResultProxy from "../../proxy/DialogBetResultProxy";
import DialogBetResultMediator from "../../mediator/DialogBetResultMediator";

@Component
export default class BetResult extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    OrderTitleUtils = OrderTitleUtils;
    MarketUtils = MarketUtils;
    amountFormat = amountFormat;
    TransMarketPrice = TransMarketPrice;
    betProxy: BetProxy = getProxy(BetProxy);
    homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    matcheProxy: MatcheProxy = getProxy(MatcheProxy);
    myProxy: DialogBetResultProxy = this.getProxy(DialogBetResultProxy);

    pageData = this.myProxy.pageData;
    parlayData = this.pageData.parlayData;
    mounted() {
        // this.pageData.statusMsg = "";
    }

    // 注单状态
    statusMap = {
        0: LangUtil("确认中"), //确认中
        1: LangUtil("确认成功"), //确认成功
        3: LangUtil("已拒绝"), //拒绝
        4: LangUtil("已取消"), //拒绝
        5: LangUtil("无效"), //无效
        8: LangUtil("准异常"), //无效
    };
    statusMapColor = {
        0: "#feba00", //确认中
        1: "#41a81d", //确认成功
        3: "#FF3C30", //拒绝
        4: "#FF2828", //取消
    };
    tipStatusMap = {
        0: {
            bgColor: "#f5e0bb",
            color: this.statusMapColor[0],
            title: LangUtil("注单确认中"),
        },
        1: {
            bgColor: "#afdfaf",
            color: this.statusMapColor[1],
            title: LangUtil("注单确认成功"),
        },
        3: {
            bgColor: "#afdfaf",
            color: this.statusMapColor[1],
            title: LangUtil("注单确认成功"),
        },
    };

    get tipStatus(): any {
        if (this.betProxy.pageData.betType == "parlay") {
            return this.pageData.parlayData.status;
        } else {
            const index = this.pageData.list.findIndex((item: any) => item.status == 0);
            return index > -1 ? 0 : 1;
        }
    }

    get successfulCount() {
        if (this.betProxy.pageData.betType == "parlay") {
            return this.pageData.parlayData.status == 1 ? 1 : 0;
        }
        let num = 0;
        //@ts-ignore
        this.pageData.list.forEach((item) => {
            if (item.status == 1) {
                num++;
            }
        });
        return num;
    }

    // get competition() {
    //     for (const comp of this.matcheProxy.pageData.competition_list) {
    //         for (const matche of comp.matches) {
    //             if (matche.id == this.pageData.event_id) {
    //                 return comp;
    //             }
    //         }
    //     }
    //     for (const comp of this.homeProxy.pageData.competition_list) {
    //         for (const matche of comp.matches) {
    //             if (matche.id == this.pageData.event_id) {
    //                 return comp;
    //             }
    //         }
    //     }
    //     return null;
    // }
    transTitle(title: any, matche: any) {
        if (!matche) {
            return title;
        }
        const homestr = LangUtil("主队").trim();
        const awaystr = LangUtil("客队").trim();
        const { home_team, away_team } = matche;
        title = title.replace(new RegExp(homestr, "ig"), home_team).replace(new RegExp(awaystr, "ig"), away_team);
        return title;
    }
    // get matches() {
    //     for (const comp of this.matcheProxy.pageData.competition_list) {
    //         for (const matche of comp.matches) {
    //             if (matche.id == this.pageData.event_id) {
    //                 return matche;
    //             }
    //         }
    //     }
    //     for (const comp of this.homeProxy.pageData.competition_list) {
    //         for (const matche of comp.matches) {
    //             if (matche.id == this.pageData.event_id) {
    //                 return matche;
    //             }
    //         }
    //     }
    //     return null;
    // }
    // get matche() {
    //     return this.pageData.matche;
    // }

    // get market(): any {
    //     return this.pageData.market;
    // }

    // get selection() {
    //     return this.pageData.selection;
    // }

    getCreateTime(create_time: any) {
        return dateFormat(new Date(create_time * 1000), "MM/dd hh:mm:ss");
    }

    onClose() {
        this.betProxy.initBetList();
        this.pageData.bShow = false;
    }

    onHold() {
        this.betProxy.initBetList(true);
        this.pageData.bShow = false;
    }
}
