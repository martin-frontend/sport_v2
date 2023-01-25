import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { MatchVO } from "@/vo/MatchVO";
import { getResponseIcon } from "@/core/global/Functions";
import PageHomeProxy from "../../proxy/PageHomeProxy";
import MarketUtils from "@/core/global/MarketUtils";
import { formatEventTime, dateFormat, getDateByTimeZone } from "@/core/global/Functions";
import PlatConfig from "@/core/config/PlatConfig";
import GlobalVar from "@/core/global/GlobalVar";
import live from "@/_skin001/views/live";
import matche from "@/_skin001/views/matche";
import right_panel from "@/_skin001/views/right_panel";
import MatcheProxy from "@/_skin001/views/matche/proxy/MatcheProxy";

@Component
export default class MatcheItem extends AbstractView {
    LangUtil = LangUtil;
    getResponseIcon = getResponseIcon;
    MarketUtils = MarketUtils;
    matcheProxy:MatcheProxy = this.getProxy(MatcheProxy);
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;
    GlobalVar = GlobalVar;
    //倒数计时
    day: any = "0";
    hr: any = "00";
    min: any = "00";
    start_in_sec = 0;

    @Prop() matche!: MatchVO;
    @Prop({ default: false }) isFirst!: boolean;
    @Prop({ default: false }) isLast!: boolean;
    showAll = false;

    /**表头 */
    marketTypeAlias: any = {
        MATCH_ODDS: "独赢",
        ASIAN_HANDICAP: "让球",
        ASIAN_OVER_UNDER: "大小",
        MATCH_ODDS_HALF_TIME: "半场独赢",
        ASIAN_HANDICAP_HALF_TIME: "半场让球",
        ASIAN_OVER_UNDER_HALF_TIME: "半场大小",
        ASIAN_HANDICAP_EXTRA_TIME: "让球加时",
        ASIAN_OVER_UNDER_EXTRA_TIME: "大小加时",
        ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME: "让球半场加时",
        ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME: "大小半场加时",
        ASIAN_HANDICAP_AFTER_PENALTIES: "让球点球",
        ASIAN_OVER_UNDER_AFTER_PENALTIES: "大小点球",
    };
    get tableColumn() {
        const arr = [];
        const marketTypes = this.marketTypes;
        for (const mtype of marketTypes) {
            const mt = PlatConfig.allMarketType.find((item) => item.market_type == mtype);
            if (mt) {
                arr.push(this.marketTypeAlias[mtype] || mt.title);
            }
        }
        if (this.$vuetify.breakpoint.width <= 1430) {
            return arr.slice(0, 3);
        } else if (this.$vuetify.breakpoint.width <= 1580) {
            return arr.slice(0, 4);
        }
        return arr;
    }

    get start_time() {
        return dateFormat(getDateByTimeZone(this.matche.sb_time * 1000, <any>GlobalVar.zone), "MM/dd hh:mm");
    }

    get start() {
        this.start_in_sec = this.matche.sb_time - GlobalVar.server_time;
        this.day = Math.floor(this.start_in_sec / 60 / 60 / 24);
        this.hr = Math.floor(this.start_in_sec / 60 / 60);
        this.min = Math.floor((this.start_in_sec / 60) % 60);
        return this.start_in_sec > 0 ? true : false;
    }

    get fixMarket() {
        const data = this.pageData.market_list.find((item) => item.event_id == this.matche.id);
        return data?.fix_markets;
    }
    get states() {
        const data = this.pageData.event_states.find((item) => item.event_id == this.matche.id);
        return data;
    }
    /**拆分比分/红黄牌/脚球 */
    getValues(str: string): number[] {
        if (str == "") {
            return [0, 0];
        } else {
            return str.split("-").map((item) => parseInt(item));
        }
    }
    /**获取需要显示的盘口 */
    get marketTypes() {
        const arr = ["1H OT", "2H OT", "OT HT"];
        let marketTypes: string[] = [];
        if (this.states && arr.includes(this.states.match_phase)) {
            marketTypes = PlatConfig.config.client.pcMarketType_extra.split(",");
        } else {
            marketTypes = PlatConfig.config.client.pcMarketType.split(",");
        }
        if (this.$vuetify.breakpoint.width <= 1450) {
            return marketTypes.slice(0, 3);
        } else if (this.$vuetify.breakpoint.width <= 1610) {
            return marketTypes.slice(0, 4);
        } else if (this.$vuetify.breakpoint.width <= 1710) {
            return marketTypes.slice(0, 5);
        }
        return marketTypes;
    }

    /**是否显示和 */
    get isShowDrow() {
        return this.marketTypes.includes("MATCH_ODDS") || this.marketTypes.includes("MATCH_ODDS_HALF_TIME");
    }

    getMarket(market_type: string) {
        //@ts-ignore
        return this.fixMarket[market_type];
    }

    getSelections(market_type: string, all: boolean = false) {
        if (!this.fixMarket) return [];
        //@ts-ignore
        const market = this.fixMarket[market_type];
        if (market) {
            const selections = market.selections;
            if (this.showAll || all) {
                if (selections.length == 0) {
                    return [{ price: {} }, { price: {} }];
                }
                return selections;
            } else {
                let len = 2;
                if (market_type == "MATCH_ODDS" || market_type == "MATCH_ODDS_HALF_TIME") {
                    len = 3;
                }
                if (selections.length == 0) {
                    return [{ price: {} }, { price: {} }];
                }
                return selections.slice(0, len);
            }
        }
        if (market_type == "MATCH_ODDS" || market_type == "MATCH_ODDS_HALF_TIME") {
            return [{ price: {} }, { price: {} }, { price: {} }];
        } else {
            return [{ price: {} }, { price: {} }];
        }
    }
    /**展开后的高度，以显示左侧的球队名 */
    getOtherGroup() {
        let len = 0;
        for (const mtype of this.marketTypes) {
            if (mtype != "MATCH_ODDS" && mtype != "MATCH_ODDS_HALF_TIME") {
                len = Math.max(len, this.getSelections(mtype, true).length);
            }
        }
        len = Math.max(len - 2, 0) / 2;
        return new Array(len);
    }

    /**是否显示全场比分，or加时比分 */
    isShowFullScore(match_phase: string): boolean {
        const arr = ["-", "1H", "HT", "2H", "FT"];
        return arr.includes(match_phase);
    }
    /**是否显示点球比分 */
    isShowPK(match_phase: string): boolean {
        const arr = ["PK", "PK FT"];
        return arr.includes(match_phase);
    }

    onShowAll() {
        this.showAll = !this.showAll;
    }

    goMatche() {
        GlobalVar.loading = true;
        matche.init(this.matche.id);
        live.init(this.matche.id);
    }

    playMatcheAnimation() {
        if (this.matche.animation_id) {
            this.goMatche();
            right_panel.show(2);
        }
    }

    onLove() {
        this.myProxy.api_user_love(this.matche.id);
    }
}
