import { objectRemoveNull } from "@/core/global/Functions";
import net from "@/net/setting";
import { MarketVO } from "@/vo/MarketVO";
import Vue from "vue";

export default class RacingPanelProxy extends puremvc.Proxy {
    static NAME = "RacingPanelProxy";

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
        market_list: <any>[],
        marketListByEventId: <any>{},
        /**赛事进程 */
        event_states: <any>[],
        eventStatesByEventId: <any>{},

        // live_event: <any>[],
        tag: 0,
    };

    listQueryComp = {
        // 1 足球、4 篮球、5 美式足球、7 赛马、8 赛狗
        sport_id: "7",
        // all: 全部 fix: 固赔 exchange: 交易所
        type: "fix",
        // withinAnHour:下一场、today:今天、tomorrow:明天、dayAfterTomorrow:後天
        tag: "withinAnHour",
        page_size: 1000,
        //球类比赛, 请带：1 、RACE 比赛, 请带：2
        event_type: 2,

        unique: RacingPanelProxy.NAME,
    };

    listQueryStates = {
        // all: 全部 fix: 固赔 exchange: 交易所
        type: "fix",
        // 多个指定赛事id，以逗号拼接
        event_id: "",
        // 记录所在位置
        unique: RacingPanelProxy.NAME,
    };

    listQueryMarket = {
        // all: 全部 fix: 固赔 exchange: 交易所
        type: "fix",
        // 多个指定赛事id，以逗号拼接
        event_id: "",
        // 记录所在位置
        unique: RacingPanelProxy.NAME,
    };

    init() {
        clearInterval(this.timer);
        this.timer = setInterval(this.getMarketAndStates.bind(this), 5000);
    }

    getMarketAndStates() {
        if (Vue.router.currentRoute.path == "/page_racing_detail") {
            const event_id: number[] = [];
            if (this.pageData.tag == 0) {
                this.pageData.competition_list.forEach((item: any) => {
                    Object.keys(item.matches).forEach((key: any) => {
                        const match = item.matches[key];
                        event_id.push(match.id);
                    });
                });
            } 
            // else if (this.pageData.tag == 1) {
            //     this.pageData.live_event.forEach((item: any) => {
            //         Object.keys(item.matches).forEach((key: any) => {
            //             const match = item.matches[key];
            //             event_id.push(match.id);
            //         });
            //     });
            // }

            this.listQueryStates.event_id = event_id.toString();
            if (this.listQueryStates.event_id) {
                // this.api_market_typelist();
                this.api_event_states();
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

            const finditem = this.pageData.market_list.find((item1: any) => item.event_id == item1.event_id);
            if (finditem) {
                Object.assign(finditem, item);
            } else {
                this.pageData.market_list.push(item);
            }
        });
    }

    set_event_states(data: any) {
        this.pageData.loading = false;
        // if (data.length == 0) return;
        const event_id = <Number[]>[];

        data.forEach((item: any) => {
            Vue.set(this.pageData.eventStatesByEventId, item.event_id, item);
            if (item.match_phase == "OPEN") {
                event_id.push(item.event_id);
            }
            const finditem = this.pageData.event_states.find((item1: any) => item.event_id == item1.event_id);
            if (finditem) {
                Object.assign(finditem, item);
            } else {
                this.pageData.event_states.push(item);
            }
        });

        this.listQueryMarket.event_id = event_id.toString();
        if (this.listQueryMarket.event_id) {
            this.api_market_typelist();
        }
    }

    // set_live_event(data: any) {
    //     this.pageData.live_event.push(...data);
    //     this.getMarketAndStates();
    // }

    /**赛事接口-新*/
    api_event_list() {
        this.pageData.loading = true;
        this.pageData.market_list = [];
        this.pageData.event_states = [];
        this.listQueryComp.sport_id = `${this.listQueryComp.sport_id}`;
        // 清除将重新查询的sport
        this.pageData.competition_list = this.pageData.competition_list.filter(
            (item: any) => !this.listQueryComp.sport_id.includes(item.sport_id)
        );
        this.sendNotification(net.HttpType.api_event_list_v3, objectRemoveNull(this.listQueryComp));
    }
    /**盘口接口-新*/
    api_market_typelist() {
        const { event_id, unique } = this.listQueryMarket;
        this.sendNotification(net.HttpType.api_market_typelist, { event_id, unique });
    }
    /**赛事进程*/
    api_event_states() {
        const { event_id, unique } = this.listQueryStates;
        this.sendNotification(net.HttpType.api_event_states, { event_id, unique });
    }
    // api_event_live_event_v2() {
    //     // 清除将重新查询的sport
    //     this.pageData.live_event = this.pageData.live_event.filter((item: any) => !this.listQueryComp.sport_id.includes(item.sport_id));
    //     const { sport_id, unique } = this.listQueryComp;
    //     this.sendNotification(net.HttpType.api_event_live_list_v2, { sport_id: Number(sport_id), unique });
    // }
}
