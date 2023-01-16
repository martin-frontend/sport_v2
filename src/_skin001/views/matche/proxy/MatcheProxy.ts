import Vue from "vue";
import PlatConfig from "@/core/config/PlatConfig";
import { objectRemoveNull } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import LangUtil from "@/core/global/LangUtil";
import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { EventStatesVO } from "@/vo/EventStatesVO";
import { MarketVO } from "@/vo/MarketVO";

export default class MatcheProxy extends puremvc.Proxy {
    static NAME = "MatcheProxy";

    private timer = 0;

    onRegister() {
        const { id } = Vue.router.currentRoute.query;
        if (id) this.init(id);
    }

    onRemove() {
        clearInterval(this.timer);
        this.pageData.market_list = [];
        this.pageData.event_states = [];
    }

    init(id: any) {
        this.onRemove();
        this.listQueryComp.event_id = id.toString();
        this.listQueryMarket.event_id = id.toString();
        this.api_event_list();
        this.api_event_hot();
    }

    pageData = {
        loading: false,
        isOpenAll: true,
        isNeedOpenAll: true,
        panelIndexs: <number[]>[],
        /**当前打开的赛事 */
        competition_list: <CompetitionVO[]>[],
        /**盘口信息 */
        market_list: <MarketVO[]>[],
        /**赛事进程 */
        event_states: <EventStatesVO[]>[],
    };

    listQueryComp = {
        sport_id: 1,
        event_id: "",
    };

    listQueryMarket = {
        type: "fix",
        event_id: "",
        market_type: 0,
    };

    get marketTypeOptions(){
        const arr = [{ id: 0, name: LangUtil("所有") }];
        arr.push(...PlatConfig.market_main_type);
        return arr;
    }

    set_event_list(data: any) {
        GlobalVar.loading = false;
        this.pageData.competition_list = data;
        this.api_market_typelist();
        this.api_event_states();
        this.timer = setInterval(() => {
            this.api_market_typelist();
            this.api_event_states();
        }, 2000);
    }
    set_market_typelist(data: any) {
        if (this.pageData.isNeedOpenAll) {
            this.pageData.isNeedOpenAll = false;
            this.pageData.market_list = [];
            setTimeout(() => {
                this.pageData.panelIndexs = [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
                    32, 33,
                ];
            }, 500);
        }

        setTimeout(() => {
            for (const item of data) {
                for (const key of Object.keys(item.fix_markets)) {
                    const market = item.fix_markets[key];
                    market.selections = market.selections.filter((item: any) => item.status == 0);
                }
                this.pageData.market_list = [item];
            }
            GlobalVar.loading = false;
        }, 100);
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
    }

    /**赛事接口-新*/
    api_event_list() {
        GlobalVar.loading = true;
        this.sendNotification(net.HttpType.api_event_list, objectRemoveNull(this.listQueryComp));
    }

    /**盘口接口-新*/
    api_market_typelist() {
        let market_type = "";
        switch (this.listQueryMarket.market_type) {
            case 0:
                market_type = PlatConfig.allMarketType.map((item) => item.market_type).toString();
                break;
            default: {
                const arr = PlatConfig.allMarketType.filter((item) =>
                    item.main_type.split(",").includes(this.listQueryMarket.market_type.toString())
                );
                market_type = arr.map((item) => item.market_type).toString();
            }
        }
        const formCopy = JSON.parse(JSON.stringify(this.listQueryMarket));
        formCopy.market_type = market_type;
        this.sendNotification(net.HttpType.api_market_typelist, objectRemoveNull(formCopy));
    }
    /**赛事进程*/
    api_event_states() {
        const idsstr = this.listQueryMarket.event_id.toString();
        this.sendNotification(net.HttpType.api_event_states, { event_id: idsstr, unique:MatcheProxy.NAME });
    }
    /**热门赛事 */
    api_event_hot() {
        this.sendNotification(net.HttpType.api_event_hot);
    }
}
