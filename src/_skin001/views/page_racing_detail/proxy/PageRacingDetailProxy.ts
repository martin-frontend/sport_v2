import PlatConfig from "@/core/config/PlatConfig";
import { objectRemoveNull } from "@/core/global/Functions";
import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { EventStatesVO } from "@/vo/EventStatesVO";
import { MarketVO } from "@/vo/MarketVO";
import Vue from "vue";

export default class PageRacingDetailProxy extends puremvc.Proxy {
    static NAME = "PageRacingDetailProxy";

    public onRegister(): void {
        this.init();
        // TODO 请求初始数据
    }
    /**计时器 */
    private timer = 0;
    pageData = {
        loading: false,
        /**联赛列表 */
        competition_list: <any>[],
        /**盘口信息 */
        market_list: <MarketVO[]>[],
        marketListByEventId: <any>{},
        /**赛事进程 */
        event_states: <EventStatesVO[]>[],
        eventStatesByEventId: <any>{},
        // 当前选择的赛事
        competitionId: 0,
        matchKey: "R1",
    };

    listQueryComp = {
        // 1 足球、4 篮球、5 美式足球、7 赛马、8 赛狗
        sport_id: "7",
        // all: 全部 fix: 固赔 exchange: 交易所
        type: "fix",
        // withinAnHour:下一场、today:今天、tomorrow:明天、dayAfterTomorrow:後天
        tag: "today",
        page_size: 1000,
        //球类比赛, 请带：1 、RACE 比赛, 请带：2
        event_type: 2,

        unique: PageRacingDetailProxy.NAME,
    };

    listQueryStates = {
        // all: 全部 fix: 固赔 exchange: 交易所
        type: "fix",
        // 多个指定赛事id，以逗号拼接
        event_id: "",
        // 记录所在位置
        unique: PageRacingDetailProxy.NAME,
    };

    // listQueryMarket = {
    //     // all: 全部 fix: 固赔 exchange: 交易所
    //     type: "fix",
    //     // 多个指定赛事id，以逗号拼接
    //     event_id: "",
    //     // 记录所在位置
    //     unique: PageRacingDetailProxy.NAME,
    // };

    init() {
        clearInterval(this.timer);
        this.timer = setInterval(this.getMarketAndStates.bind(this), 5000);
    }

    getMarketAndStates() {
        if (Vue.router.currentRoute.path == "/page_racing_detail") {
            const findItem = this.pageData.competition_list.find((item: any) => item.competition_id == this.pageData.competitionId);
            const event_id = findItem?.matches[this.pageData.matchKey]?.id;
            this.listQueryStates.event_id = event_id?.toString();
            if (this.listQueryStates.event_id) {
                this.api_event_states();
                this.api_market_typelist();
            } else {
                this.pageData.loading = false;
            }
        }
    }

    set_event_list(data: any) {
        this.pageData.competition_list.push(...data);
        this.getMarketAndStates();
    }

    set_market_typelist(data: any) {
        data.forEach((item: any) => {
            Vue.set(this.pageData.marketListByEventId, item.event_id, item);
            // Vue.set(this.pageData.marketListByEventId, this.listQueryStates.event_id, item);
            
            const finditem = this.pageData.market_list.find((item1) => item.event_id == item1.event_id);
            if (finditem) {
                Object.assign(finditem, item);
            } else {
                this.pageData.market_list.push(item);
            }
        });
    }

    set_event_states(data: any) {
        this.pageData.loading = false;

        data.forEach((item: any) => {
            Vue.set(this.pageData.eventStatesByEventId, item.event_id, item);
            const finditem = this.pageData.event_states.find((item1) => item.event_id == item1.event_id);
            if (finditem) {
                Object.assign(finditem, item);
            } else {
                this.pageData.event_states.push(item);
            }
        });
    }

    /**赛事接口-新*/
    api_event_list() {
        this.pageData.loading = true;
        this.pageData.market_list = [];
        this.pageData.event_states = [];
        this.pageData.competition_list = [];
        this.listQueryComp.sport_id = `${this.listQueryComp.sport_id}`;
        this.sendNotification(net.HttpType.api_event_list_v3, objectRemoveNull(this.listQueryComp));
    }
    /**盘口接口-新*/
    api_market_typelist() {
        const { event_id, unique } = this.listQueryStates;
        this.sendNotification(net.HttpType.api_market_typelist, { event_id, unique });
    }
    /**赛事进程*/
    api_event_states() {
        const { event_id, unique } = this.listQueryStates;
        this.sendNotification(net.HttpType.api_event_states, { event_id, unique });
    }
}
