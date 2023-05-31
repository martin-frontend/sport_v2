import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { getResponseIcon } from "@/core/global/Functions";
import getProxy from "@/core/global/getProxy";
import { MarketVO } from "@/vo/MarketVO";
import { EnumMarketType } from "@/enum/EnumMarketType";
import MatcheProxy from "../../proxy/MatcheProxy";
import { MatchVO } from "@/vo/MatchVO";
import MarketUtils from "@/core/global/MarketUtils";

@Component
export default class MarketM7 extends AbstractView {
    LangUtil = LangUtil;
    MarketUtils = MarketUtils;
    getResponseIcon = getResponseIcon;
    myProxy: MatcheProxy = getProxy(MatcheProxy);
    pageData = this.myProxy.pageData;

    enumMarketType = EnumMarketType;

    @Prop() matche!: MatchVO;
    @Prop() market!: any;

    get marketOrder1() {
        return this.market.selections.filter((item: any) => item.order == 1);
    }
    get marketOrder2() {
        return this.market.selections.filter((item: any) => item.order == 2);
    }
    get marketOrder3() {
        return this.market.selections.filter((item: any) => item.order == 3);
    }
    transTitle(market_type: any, item: any) {
        let rs = MarketUtils.getSelectionName(market_type, item);
        const homestr = LangUtil("主").trim();
        const awaystr = LangUtil("客").trim();
        const { home_team, away_team } = this.matche;
        rs = rs.replace(new RegExp(homestr, "ig"), home_team).replace(new RegExp(awaystr, "ig"), away_team);
        return rs;
    }
}
