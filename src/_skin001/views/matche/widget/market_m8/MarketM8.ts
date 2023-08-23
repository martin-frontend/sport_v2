import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import getProxy from "@/core/global/getProxy";
import { FixSelectionVO, MarketVO } from "@/vo/MarketVO";
import { getResponseIcon } from "@/core/global/Functions";
import { EnumMarketType } from "@/enum/EnumMarketType";
import MatcheProxy from "../../proxy/MatcheProxy";
import { MatchVO } from "@/vo/MatchVO";

@Component
export default class MarketM8 extends AbstractView {
    LangUtil = LangUtil;
    getResponseIcon = getResponseIcon;
    myProxy: MatcheProxy = getProxy(MatcheProxy);
    pageData = this.myProxy.pageData;

    enumMarketType = EnumMarketType;

    @Prop() matche!: MatchVO;
    @Prop() market!: MarketVO;

    getPrice(selection: FixSelectionVO) {
        if (selection && selection.price && selection.price.back) {
            return selection.price.back;
        }
        return "--";
    }
}
