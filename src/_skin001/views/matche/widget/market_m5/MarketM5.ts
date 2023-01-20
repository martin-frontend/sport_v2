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
export default class MarketM5 extends AbstractView {
    LangUtil = LangUtil;
    MarketUtils = MarketUtils;
    getResponseIcon = getResponseIcon;
    myProxy: MatcheProxy = getProxy(MatcheProxy);
    pageData = this.myProxy.pageData;

    enumMarketType = EnumMarketType;

    @Prop() matche!: MatchVO;
    @Prop() market!: any;

    get marketOrder1() {
        return this.market.selections.filter((item: any) => {
            if (item.name != "Other") {
                const arr = item.name.split("-").map((item: any) => parseInt(item));
                return arr[0] > arr[1];
            }
            return false;
        });
    }
    get marketOrder2() {
        return this.market.selections.filter((item: any) => {
            if (item.name != "Other") {
                const arr = item.name.split("-").map((item: any) => parseInt(item));
                return arr[0] == arr[1];
            }
            return true;
        });
    }
    get marketOrder3() {
        return this.market.selections.filter((item: any) => {
            if (item.name != "Other") {
                const arr = item.name.split("-").map((item: any) => parseInt(item));
                return arr[0] < arr[1];
            }
            return false;
        });
    }
}
