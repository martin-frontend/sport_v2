import Vue from "vue";
import GlobalVar from "@/core/global/GlobalVar";
import AbstractView from "@/core/abstract/AbstractView";
import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { EventStatesVO } from "@/vo/EventStatesVO";
import { MarketVO } from "@/vo/MarketVO";
import { MenuSubCenterVO, MenuSubTopVO } from "@/vo/MenuNavVO";
import { objectRemoveNull, logEnterTips } from "@/core/global/Functions";
import PlatConfig from "@/core/config/PlatConfig";
import getProxy from "@/core/global/getProxy";
import SelfProxy from "@/proxy/SelfProxy";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
export default class PageHomeProxy extends puremvc.Proxy {
    static NAME = "PageHomeProxy";
    /**是否第一次进入首页 */
    isFirstRequest = true;
    /**计时器 */
    private timer = 0;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    user_type = 2;
    public onRegister(): void {
        const { user_type } = this.selfProxy.userInfo;
        this.user_type = user_type;
        this.api_user_lovematch();
        this.init();
    }

    pageData = {
        loading: true,
        /**打开的联赛索引 */
        openIndexs: [0, 1, 2],
        /**联赛列表 */
        competition_list: <CompetitionVO[]>[],
        /**盘口信息 */
        market_list: <MarketVO[]>[],
        /**赛事进程 */
        event_states: <EventStatesVO[]>[],
        /**关注赛事 */
        love_count: 0,
        love_events: <any[]>[],
        menu_subnav: {
            top: <MenuSubTopVO[]>[],
            center: <MenuSubCenterVO[]>[],
        },
        // 滚动的位置
        scrollOffset: 0,
        //获取关注计数
        lovematch_order: 0,
    };

    listQueryComp = {
        // 1 足球、4 篮球、5 美式足球、7 赛马、8 赛狗
        sport_id: 1,
        // all: 全部 fix: 固赔 exchange: 交易所
        type: "fix",
        // inplay: 滚球 today: 今日 future: 早盘  (love: 关注) search: 搜索
        tag: "inplay",
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
        event_type: 1,

        unique: PageHomeProxy.NAME,
    };

    listQueryMarket = {
        // all: 全部 fix: 固赔 exchange: 交易所
        type: "fix",
        // 多个指定赛事id，以逗号拼接
        event_id: "",
        // 对应的盘口类型，以逗号拼接
        market_type: "MATCH_ODDS,MATCH_ODDS_HALF_TIME,ASIAN_HANDICAP,ASIAN_HANDICAP_HALF_TIME,ASIAN_OVER_UNDER,ASIAN_OVER_UNDER_HALF_TIME",
        // 记录所在位置
        unique: PageHomeProxy.NAME,
        //暂时不用的
        market_id: "",
    };

    init() {
        clearInterval(this.timer);
        this.timer = setInterval(this.getMarketAndStates.bind(this), 5000);
    }

    get competition_list() {
        if (this.listQueryComp.tag == "today") {
            const settingProxy: SettingProxy = getProxy(SettingProxy);
            if (settingProxy.pageData.form.todayEarly == "1") {
                return this.pageData.competition_list;
            } else {
                const arr = [];
                for (const comp of this.pageData.competition_list) {
                    const c: CompetitionVO = JSON.parse(JSON.stringify(comp));
                    c.count = 0;
                    c.matches = [];
                    for (const m of comp.matches) {
                        if (m.sb_time > GlobalVar.server_time) {
                            c.matches.push(m);
                        }
                    }
                    c.count = c.matches.length;
                    if (c.count > 0) {
                        arr.push(c);
                    }
                    // break;
                }
                return arr;
            }
        } else {
            return this.pageData.competition_list;
        }
    }

    getMarketAndStates() {
        if (Vue.router.currentRoute.path == "/page_home") {
            const event_id: number[] = [];
            for (const index of this.pageData.openIndexs) {
                const item = this.competition_list[index];
                if (item && item.matches) {
                    for (const match of item.matches) {
                        if (event_id.indexOf(match.id) == -1) event_id.push(match.id);
                    }
                }
            }
            this.listQueryMarket.event_id = event_id.toString();
            if (this.listQueryMarket.event_id) {
                this.api_market_typelist();
                this.api_event_states();
            }
        }
    }

    set_event_list(data: any) {
        this.pageData.loading = false;
        this.pageData.competition_list = data;
        this.pageData.openIndexs = [0, 1, 2];
        this.getMarketAndStates();
    }
    set_market_typelist(data: any) {
        for (const item of data) {
            for (const key of Object.keys(item.fix_markets)) {
                const market = item.fix_markets[key];
                market.selections = market.selections.filter((item: any) => item.status == 0);
            }
            const finditem = this.pageData.market_list.find((item1) => item.event_id == item1.event_id);
            if (finditem) {
                Object.assign(finditem, item);
            } else {
                this.pageData.market_list.push(item);
            }
        }
    }
    updateMarketCount(data: any) {
        for (const item of data) {
            const { event_id, market_amount } = item;
            for (const comp of this.pageData.competition_list) {
                for (const matche of comp.matches) {
                    if (matche.id == event_id) {
                        matche.market_amount = market_amount;
                        break;
                    }
                }
            }
        }
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
    set_user_lovematch(data: any) {
        if (this.listQueryComp.tag == "love") this.pageData.loading = false;
        this.pageData.love_count = data.reduce((previousValue: any, current: any) => previousValue + current.count, 0);
        this.pageData.love_events = [];
        for (const comp of data) {
            for (const matche of comp.matches) {
                this.pageData.love_events.push(matche.id);
            }
        }

        if (this.listQueryComp.tag == "love") {
            this.pageData.competition_list = data;
            this.pageData.openIndexs = [0, 1, 2];
        }
    }

    /**赛事接口-新*/
    // api_event_list() {
    //     if (this.listQueryComp.tag != "love") {
    //         this.pageData.loading = true;
    //         this.pageData.market_list = [];
    //         this.sendNotification(net.HttpType.api_event_list, objectRemoveNull(this.listQueryComp));
    //     } else {
    //         this.api_user_lovematch();
    //     }
    // }
    /**赛事接口-新*/
    api_event_list() {
        if (this.listQueryComp.tag != "love") {
            this.pageData.loading = true;
            this.pageData.market_list = [];
            this.listQueryComp.sport_id = Number(this.listQueryComp.sport_id);
            this.sendNotification(net.HttpType.api_event_list_v3, objectRemoveNull(this.listQueryComp));
        } else {
            this.api_user_lovematch();
        }
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
    /**关注 */
    api_user_lovematch() {
        if (this.listQueryComp.tag == "love") this.pageData.loading = true;
        this.pageData.lovematch_order++;
        this.sendNotification(net.HttpType.api_user_lovematch, { unique: this.pageData.lovematch_order });
    }
    api_user_love(event_id: number) {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        const idx = this.pageData.love_events.indexOf(event_id);
        if (idx != -1) {
            this.pageData.love_events.splice(idx, 1);
        } else {
            this.pageData.love_events.push(event_id);
        }
        //如果在关注页，直接删除该赛事
        if (this.listQueryComp.tag == "love") {
            for (const comp of this.pageData.competition_list) {
                const len = comp.matches.length;
                for (let i = 0; i < len; i++) {
                    if (comp.matches[i].id == event_id) {
                        comp.matches.splice(idx, 1);
                        break;
                    }
                }
            }
        }
        this.sendNotification(net.HttpType.api_user_love, { event_id: event_id.toString() });
    }

    api_menu_subnav() {
        this.sendNotification(net.HttpType.api_menu_subnav);
    }
}
