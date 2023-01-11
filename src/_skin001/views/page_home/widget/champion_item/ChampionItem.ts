import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { MatchVO } from "@/vo/MatchVO";
import PageLobbyProxy from "../../proxy/PageLobbyProxy";
import MarketUtils from "@/core/global/MarketUtils";
import PlatConfig from "@/core/config/PlatConfig";

@Component
export default class ChampionItem extends AbstractView {
    LangUtil = LangUtil;
    MarketUtils = MarketUtils;
    @Prop() matche!: MatchVO;
    myProxy: PageLobbyProxy = this.getProxy(PageLobbyProxy);
    pageData = this.myProxy.pageData;
    /**盘口类型 */
    marketType = PlatConfig.config.client.champion_type.split(",");

    get fixMarket() {
        const data = this.pageData.market_list.find((item) => item.event_id == this.matche.id);
        return data?.fix_markets;
    }
    get states() {
        const data = this.pageData.event_states.find((item) => item.event_id == this.matche.id);
        return data;
    }

    getMarket(market_type: string) {
        if (this.fixMarket) {
            //@ts-ignore
            return this.fixMarket[market_type];
        }
        return null;
    }

    getSelections(market_type: string, all: boolean = false) {
        if (!this.fixMarket) return [];
        //@ts-ignore
        const market = this.fixMarket[market_type];
        return market.selections;
    }
}
