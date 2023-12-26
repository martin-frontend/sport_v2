import Vue from "vue";
import PlatConfig from "@/core/config/PlatConfig";
import { objectRemoveNull } from "@/core/global/Functions";
import LangUtil from "@/core/global/LangUtil";
import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { MarketVO } from "@/vo/MarketVO";
import SportUtil from "@/core/global/SportUtil";

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
    }

    init(id: any) {
        this.onRemove();
        this.listQueryComp.event_id = id.toString();
        this.listQueryMarket.event_id = id.toString();
        this.api_event_list();
        this.api_event_hot();
        if (Vue.vuetify.framework.breakpoint.mobile) this.api_event_market_type_v2();
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
        marketTypeOptions: <any>{
            market_main_type: <any>[],
            market_type: <any>[],
        },
    };

    listQueryComp = {
        sport_id: 1,
        tag: "",
        event_type: 1,
        event_id: "",
        unique: MatcheProxy.NAME,
    };

    listQueryMarket = {
        type: "fix",
        event_id: "",
        market_type: 0,
        unique: MatcheProxy.NAME,
    };

    set_event_list(data: any) {
        this.pageData.competition_list = data;
        this.api_market_typelist();
        this.timer = setInterval(() => {
            this.api_market_typelist();
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
            // GlobalVar.loading = false;
            this.pageData.loading = false;
        }, 100);
    }

    set_event_market_type_v2(data: any) {
        Object.assign(this.pageData.marketTypeOptions, { ...data });
    }

    /**赛事接口-新*/
    api_event_list() {
        // GlobalVar.loading = true;
        this.pageData.loading = true;
        this.listQueryMarket.market_type = 0;
        this.listQueryComp.event_type = SportUtil.isRaceEvent(this.listQueryComp.sport_id) ? 2 : 1;
        this.sendNotification(net.HttpType.api_event_list_v3, objectRemoveNull(this.listQueryComp));
    }

    /**盘口接口-新*/
    api_market_typelist() {
        if (SportUtil.isRaceEvent(this.listQueryComp.sport_id)) return;

        let market_type = "";
        switch (this.listQueryMarket.market_type) {
            case 0:
                market_type = this.pageData.marketTypeOptions.market_type.map((item: any) => item.market_type).toString();
                break;
            default: {
                const arr = this.pageData.marketTypeOptions.market_type.filter((item: any) =>
                    item.main_type.split(",").includes(this.listQueryMarket.market_type.toString())
                );
                market_type = arr.map((item: any) => item.market_type).toString();
            }
        }
        const formCopy = JSON.parse(JSON.stringify(this.listQueryMarket));
        formCopy.market_type = market_type;
        if (market_type) {
            this.sendNotification(net.HttpType.api_market_typelist, formCopy);
        } else {
            this.set_market_typelist([]);
        }
    }
    /**热门赛事 */
    api_event_hot() {
        this.sendNotification(net.HttpType.api_event_hot);
    }

    api_event_market_type_v2() {
        this.sendNotification(net.HttpType.api_event_market_type_v2, {
            sport_id: this.listQueryComp.sport_id,
            unique: MatcheProxy.NAME,
        });
    }
}
