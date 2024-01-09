import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageRacingDetailProxy from "../proxy/PageRacingDetailProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

export default class PageRacingDetailMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [
            net.EventType.api_event_list_v3,
            net.EventType.api_market_typelist,
            net.EventType.api_event_states,
            net.EventType.api_event_race_detail,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: PageRacingDetailProxy = getProxy(PageRacingDetailProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_list_v3:
                if (type == PageRacingDetailProxy.NAME) {
                    myProxy.set_event_list(body);
                }
                break;
            case net.EventType.api_market_typelist:
                if (type == PageRacingDetailProxy.NAME) {
                    myProxy.set_market_typelist(body);
                }
                //  else if (type == MatcheProxy.NAME) {
                //     myProxy.updateMarketCount(body);
                // }
                break;
            case net.EventType.api_event_race_detail:
                myProxy.set_detail_data(body);
                break;
            case net.EventType.api_event_states:
                if (type == PageRacingDetailProxy.NAME) {
                    myProxy.set_event_states(body);
                }
                break;
        }
    }
}
