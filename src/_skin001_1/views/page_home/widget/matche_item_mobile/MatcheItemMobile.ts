import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { getFullTime, getResponseIcon } from "@/core/global/Functions";
import { MatchVO } from "@/vo/MatchVO";
import PageHomeProxy from "@/_skin001/views/page_home/proxy/PageHomeProxy";
import MarketUtils from "@/core/global/MarketUtils";
import { formatEventTime, dateFormat, getDateByTimeZone } from "@/core/global/Functions";
import PlatConfig from "@/core/config/PlatConfig";
import GlobalVar from "@/core/global/GlobalVar";
import matche from "@/_skin001/views/matche";
import page_matche from "@/_skin001/views/page_matche";
import NavigationProxy from "@/_skin001/views/navigation/proxy/NavigationProxy";

@Component
export default class MatcheItemMobile extends AbstractView {
    LangUtil = LangUtil;
    MarketUtils = MarketUtils;
    getResponseIcon = getResponseIcon;
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;
    GlobalVar = GlobalVar;
    getFullTime = getFullTime;
    //倒数计时
    day: any = "0";
    hr: any = "00";
    min: any = "00";
    start_in_sec = 0;

    @Prop() matche!: MatchVO;
    showAll = false;

    get start_time() {
        return dateFormat(getDateByTimeZone(this.matche.sb_time * 1000, GlobalVar.zone), "MM/dd hh:mm", true);
    }

    get start() {
        this.start_in_sec = this.matche.sb_time - GlobalVar.server_time;
        this.day = Math.floor(this.start_in_sec / 60 / 60 / 24);
        this.hr = Math.floor(this.start_in_sec / 60 / 60);
        this.min = Math.floor((this.start_in_sec / 60) % 60);
        return this.start_in_sec > 0 ? true : false;
    }

    get marketAmount() {
        const data = this.pageData.market_list.find((item) => item.event_id == this.matche.id);
        return data?.market_amount;
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
        if (!this.fixMarket) return [];
        const arr = ["1H OT", "2H OT", "OT HT"];
        const { sport_id } = this.listQueryComp;
        let marketTypes: string[] = [];
        if (this.states && arr.includes(this.states.match_phase)) {
            marketTypes = PlatConfig.config.client.h5MarketTypeExtraBySportId[sport_id]?.split(",");
        } else {
            marketTypes = PlatConfig.config.client.h5MarketTypeBySportId[sport_id]?.split(",") || [];
        }
        return marketTypes.slice(0, 2);
    }
    /**是否显示和 */
    get isShowDrow() {
        return this.marketTypes.includes("MATCH_ODDS") || this.marketTypes.includes("MATCH_ODDS_HALF_TIME");
    }

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
        const { sport_id } = this.listQueryComp;
        if (sport_id == 1) {
            return ["1", "x", "2"];
        } else {
            return [LangUtil("大"), LangUtil("小")];
        }
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
            if (market_type == "MATCH_ODDS") {
                return [selections[0], selections[2], selections[1]];
            }
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
        return [{ price: {} }, { price: {} }, { price: {} }];
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
        // console.warn("isShowFullScore: ", arr.includes(match_phase));
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
        page_matche.show(this.matche.id);
    }

    onLove() {
        // 如果在关注页，直接删除该赛事
        if (this.listQueryComp.tag == "love") {
            const findIndex = this.pageData.competition_list.findIndex((item) => item.competition_id == this.matche.competition_id);
            const comp: any = this.pageData.competition_list[findIndex];            
            const len = comp.matches.length;
            if (len == 1) {
                this.pageData.competition_list.splice(findIndex, 1);
            } else {
                for (let i = 0; i < len; i++) {
                    if (this.matche.id == comp.matches[i].id) {
                        comp.matches.splice(i, 1);
                        break;
                    }
                }
            }
        }
        this.myProxy.api_user_love(this.matche.competition_id, this.matche.id);
    }

    get curSportLove() {
        return this.navProxy.pageData.new_menu_subnav[this.listQueryComp.sport_id]?.favorite.events || [];
    }
}
