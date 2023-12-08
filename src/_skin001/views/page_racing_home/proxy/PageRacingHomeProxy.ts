import PlatConfig from "@/core/config/PlatConfig";
import { objectRemoveNull } from "@/core/global/Functions";
import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { EventStatesVO } from "@/vo/EventStatesVO";
import { MarketVO } from "@/vo/MarketVO";
import Vue from "vue";

export default class PageRacingHomeProxy extends puremvc.Proxy {
    static NAME = "PageRacingHomeProxy";

    public onRegister(): void {
        this.pageData.loading = true;
        // TODO 请求初始数据
    }

    pageData = {
        loading: false,
        /**联赛列表 */
        competition_list: <any>{},
        /**盘口信息 */
        market_list: <MarketVO[]>[],
        /**赛事进程 */
        event_states: <EventStatesVO[]>[],
    };

    listQueryComp = {
        // 1 足球、4 篮球、5 美式足球、7 赛马、8 赛狗
        sport_id: 7,
        // all: 全部 fix: 固赔 exchange: 交易所
        type: "fix",
        // withinAnHour:下一场、today:今天、tomorrow:明天、dayAfterTomorrow:後天
        tag: "today",
        //comp: 联赛 time: 时间
        sort: "comp",

        //每次搜索前清空以下参数, 且最多只取一个值
        keyword: "",
        country: "",
        competition_id: "",

        //暂时不用的
        event_id: "",
        market_id: "",
        market_type: "",
        page_size: 1000,
        //球类比赛, 请带：1 、RACE 比赛, 请带：2
        event_type: 2,

        unique: PageRacingHomeProxy.NAME,
    };

    listQueryMarket = {
        // all: 全部 fix: 固赔 exchange: 交易所
        type: "fix",
        // 多个指定赛事id，以逗号拼接
        event_id: "",
        // 对应的盘口类型，以逗号拼接
        market_type: "MATCH_ODDS,MATCH_ODDS_HALF_TIME,ASIAN_HANDICAP,ASIAN_HANDICAP_HALF_TIME,ASIAN_OVER_UNDER,ASIAN_OVER_UNDER_HALF_TIME",
        // 记录所在位置
        unique: PageRacingHomeProxy.NAME,
        //暂时不用的
        market_id: "",
    };

    getMarketAndStates() {
        // if (Vue.router.currentRoute.path == "/page_home") {
            const event_id: number[] = [];
            // for (const index of this.pageData.openIndexs) {
            //     const item = this.competition_list[index];
            //     if (item && item.matches) {
            //         for (const match of item.matches) {
            //             if (event_id.indexOf(match.id) == -1) event_id.push(match.id);
            //         }
            //     }
            // }
            this.listQueryMarket.event_id = event_id.toString();
            if (this.listQueryMarket.event_id) {
                this.api_market_typelist();
                this.api_event_states();
            }
        // }
    }

    set_event_list(data: any) {
        this.pageData.loading = false;
        const { sport_id } = this.listQueryComp;
        Vue.set(this.pageData.competition_list, sport_id, data);
        // this.pageData.competition_list[sport_id] = data;
        // this.getMarketAndStates();
    }
    set_market_typelist(data: any) {
        // for (const item of data) {
        //     for (const key of Object.keys(item.fix_markets)) {
        //         const market = item.fix_markets[key];
        //         market.selections = market.selections.filter((item: any) => item.status == 0);
        //     }
        //     const finditem = this.pageData.market_list.find((item1) => item.event_id == item1.event_id);
        //     if (finditem) {
        //         Object.assign(finditem, item);
        //     } else {
        //         this.pageData.market_list.push(item);
        //     }
        // }
    }
    updateMarketCount(data: any) {
        // for (const item of data) {
        //     const { event_id, market_amount } = item;
        //     for (const comp of this.pageData.competition_list) {
        //         for (const matche of comp.matches) {
        //             if (matche.id == event_id) {
        //                 matche.market_amount = market_amount;
        //                 break;
        //             }
        //         }
        //     }
        // }
    }
    set_event_states(data: any) {
        for (const item of data) {
            const finditem = this.pageData.event_states.find((item1) => item.event_id == item1.event_id);
            if (finditem) {
                Object.assign(finditem, item);
            } else {
                this.pageData.event_states.push(item);
            }
        }
        // TODO 移除已经结束的赛事
    }

    /**赛事接口-新*/
    api_event_list() {
        this.pageData.loading = true;
        this.pageData.market_list = [];
        this.listQueryComp.sport_id = Number(this.listQueryComp.sport_id);
        this.sendNotification(net.HttpType.api_event_list_v3, objectRemoveNull(this.listQueryComp));
    }
    /**盘口接口-新*/
    api_market_typelist() {
        const vuetify = Vue.vuetify;
        if (this.listQueryComp.tag == "champion") {
            this.listQueryMarket.market_type = PlatConfig.config.client.champion_type;
        } else {
            const { h5MarketType, pcMarketType, h5MarketType_extra, pcMarketType_extra } = PlatConfig.config.client;
            if (vuetify.framework.breakpoint.mobile) {
                this.listQueryMarket.market_type = h5MarketType;
                if (h5MarketType_extra) this.listQueryMarket.market_type += "," + h5MarketType_extra;
            } else {
                this.listQueryMarket.market_type = pcMarketType;
                if (pcMarketType_extra) this.listQueryMarket.market_type += "," + pcMarketType_extra;
            }
        }
        this.sendNotification(net.HttpType.api_market_typelist, objectRemoveNull(this.listQueryMarket));
    }
    /**赛事进程*/
    api_event_states() {
        const { event_id, unique } = this.listQueryMarket;
        this.sendNotification(net.HttpType.api_event_states, { event_id, unique });
    }
}
