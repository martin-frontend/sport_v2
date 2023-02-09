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

    mounted(){
        this.pageData.statusMsg = "";
    }

    // 注单状态
    statusMap = {
        0: LangUtil("确认中"), //确认中
        1: LangUtil("确认成功"), //确认成功
        3: LangUtil("已拒绝"), //拒绝
        4: LangUtil("已取消"), //拒绝
        5: LangUtil("无效"), //无效
    };
    statusMapColor = {
        0: "#FF7128", //确认中
        1: "#007E29", //确认成功
        3: "#7E0000", //拒绝
        4: "#FF2828", //取消
    };

    get competition() {
        for (const comp of this.matcheProxy.pageData.competition_list) {
            for (const matche of comp.matches) {
                if (matche.id == this.pageData.event_id) {
                    return comp;
                }
            }
        }
        for (const comp of this.homeProxy.pageData.competition_list) {
            for (const matche of comp.matches) {
                if (matche.id == this.pageData.event_id) {
                    return comp;
                }
            }
        }
        return null;
    }

    get matche() {
        return this.pageData.matche;
    }

    get market(): any {
        return this.pageData.market;
    }

    get selection() {
        return this.pageData.selection;
    }

    getCreateTime() {
        return dateFormat(new Date(this.pageData.create_time * 1000), "MM/dd hh:mm:ss");
    }

    onClose() {
        this.pageData.bShow = false;
    }
}
