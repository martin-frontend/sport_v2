import AbstractMediator from "@/core/abstract/AbstractMediator";
import RacingPanelProxy from "../proxy/RacingPanelProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

export default class RacingPanelMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [
            net.EventType.api_event_list_v3,
            net.EventType.api_market_typelist,
            net.EventType.api_event_states,
            // net.EventType.api_event_live_list_v2,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: RacingPanelProxy = getProxy(RacingPanelProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_list_v3:
                if (type == RacingPanelProxy.NAME) {
                    myProxy.set_event_list(body);
                }
                break;
            case net.EventType.api_market_typelist:
                if (type == RacingPanelProxy.NAME) {
                    myProxy.set_market_typelist(body);
                }
                //  else if (type == MatcheProxy.NAME) {
                //     myProxy.updateMarketCount(body);
                // }
                break;
            case net.EventType.api_event_states:
                if (type == RacingPanelProxy.NAME) {
                    myProxy.set_event_states(body);
                }
                break;
            // case net.EventType.api_event_live_list_v2:
            //     if (type == RacingPanelProxy.NAME) {
            //         myProxy.set_live_event(body);
            //     }
            //     break;
        }
    }
}
