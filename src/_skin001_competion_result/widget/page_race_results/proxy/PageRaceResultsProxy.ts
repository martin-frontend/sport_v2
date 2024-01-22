import net from "@/net/setting";
import { EventStatesVO } from "@/vo/EventStatesVO";
import PlatConfig from "@/core/config/PlatConfig";
import LangUtil from "@/core/global/LangUtil";
import { objectRemoveNull } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import Vue from "vue";

export default class PageRaceResultsProxy extends puremvc.Proxy {
    static NAME = "PageRaceResultsProxy";
    public onRegister(): void {}

    pageData = {
        competitionName: "",
        event_id: "",
        /**赛事进程 */
        event_states: <any>{},
        market_list: <any>{},
        matche: {},
        loading: false,
        marketType: <any>[],
    };
    listQueryMarket = {
        event_id: "",
        unique: "raceResult",
    };

    /**赛事进程 写入*/
    set_api_event_states(data: any) {
        Vue.set(this.pageData.event_states, this.pageData.event_id, data[0]);
    }

    set_api_market_typelist(data: any) {
        Vue.set(this.pageData.market_list, this.pageData.event_id, data[0]);
    }

    api_event_states(id: any) {
        const { unique } = this.listQueryMarket;
        const data = { event_id: id.toString(), unique };
        GlobalVar.loading = true;
        this.sendNotification(net.HttpType.api_event_states, data);
    }

    api_market_typelist(id: any) {
        const { unique } = this.listQueryMarket;
        const data = { event_id: id.toString(), unique };
        GlobalVar.loading = true;
        this.sendNotification(net.HttpType.api_market_typelist, data);
    }
}
