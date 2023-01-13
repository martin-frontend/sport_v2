import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import getProxy from "@/core/global/getProxy";
import { getResponseIcon } from "@/core/global/Functions";
import { EnumMarketType } from "@/enum/EnumMarketType";
import PageMatcheProxy from "../../proxy/PageMatcheProxy";
import { MatchVO } from "@/vo/MatchVO";
import MarketUtils from "@/core/global/MarketUtils";

@Component
export default class MarketM6 extends AbstractView {
    LangUtil = LangUtil;
    MarketUtils = MarketUtils;
    getResponseIcon = getResponseIcon;
    myProxy: PageMatcheProxy = getProxy(PageMatcheProxy);
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
}
