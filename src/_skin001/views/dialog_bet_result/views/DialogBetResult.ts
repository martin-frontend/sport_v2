import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import DialogBetResultMediator from "../mediator/DialogBetResultMediator";
import DialogBetResultProxy from "../proxy/DialogBetResultProxy";
import LangUtil from "@/core/global/LangUtil";
import BetProxy from "@/proxy/BetProxy";
import getProxy from "@/core/global/getProxy";
import MatcheProxy from "../../matche/proxy/MatcheProxy";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import MarketUtils from "@/core/global/MarketUtils";
import { amountFormat, dateFormat, TransMarketPrice } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import BlurUtil from "@/core/global/BlurUtil";

@Component
export default class DialogBetResult extends AbstractView {
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

    constructor() {
        super(DialogBetResultMediator);
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
        for (const comp of this.matcheProxy.pageData.competition_list) {
            for (const matche of comp.matches) {
                if (matche.id == this.pageData.event_id) {
                    return matche;
                }
            }
        }
        for (const comp of this.homeProxy.pageData.competition_list) {
            for (const matche of comp.matches) {
                if (matche.id == this.pageData.event_id) {
                    return matche;
                }
            }
        }
        return null;
    }

    get market(): any {
        for (const mar of this.matcheProxy.pageData.market_list) {
            if (mar.event_id == this.pageData.event_id) {
                return mar.fix_markets[this.pageData.market_type];
            }
        }
        for (const mar of this.homeProxy.pageData.market_list) {
            if (mar.event_id == this.pageData.event_id) {
                return mar.fix_markets[this.pageData.market_type];
            }
        }
        return null;
    }

    get selection() {
        if (this.market) {
            for (const sel of this.market.selections) {
                if (sel.id == this.pageData.selection_id) {
                    return sel;
                }
            }
        }
        return null;
    }

    getCreateTime() {
        return dateFormat(new Date(this.pageData.create_time * 1000), "yyyy/MM/dd hh:mm:ss");
    }

    onClose() {
        this.pageData.bShow = false;
    }

    @Watch("pageData.bShow")
    onWatchShow(){
        if(this.pageData.bShow){
            setTimeout(() => {
                BlurUtil(this.pageData.bShow);
            }, 200);
        }else{
            BlurUtil(this.pageData.bShow);
        }
    }
}
