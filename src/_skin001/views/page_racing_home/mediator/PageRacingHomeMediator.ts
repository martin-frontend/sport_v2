import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageRacingHomeProxy from "../proxy/PageRacingHomeProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

export default class PageRacingHomeMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [net.EventType.api_event_list_v3, net.EventType.api_market_typelist, net.EventType.api_event_states];
    }
    resAcount = 0;
    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: PageRacingHomeProxy = getProxy(PageRacingHomeProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_list_v3:
                if (type == PageRacingHomeProxy.NAME) {
                    this.resAcount++;
                    if (myProxy.listQueryComp.getAcount == body.requestData.getAcount) {
                        myProxy.set_event_list(body);
                    }
                }
                break;
            case net.EventType.api_market_typelist:
                if (type == PageRacingHomeProxy.NAME) {
                    myProxy.set_market_typelist(body);
                }
                //  else if (type == MatcheProxy.NAME) {
                //     myProxy.updateMarketCount(body);
                // }
                break;
            case net.EventType.api_event_states:
                if (type == PageRacingHomeProxy.NAME) {
                    myProxy.set_event_states(body);
                }
                break;
        }
    }
}
