import AbstractMediator from "@/core/abstract/AbstractMediator";
import LiveProxy from "../proxy/LiveProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

export default class LiveMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [net.EventType.api_event_list, net.EventType.api_event_states, net.EventType.api_event_live_url];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: LiveProxy = getProxy(LiveProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_list:
                if (type == LiveProxy.NAME) {
                    myProxy.set_event_list(body);
                }
                break;
            case net.EventType.api_event_states:
                if (type == LiveProxy.NAME) {
                    myProxy.set_event_states(body);
                }
                break;
            // case net.EventType.api_event_live_url:
            //     myProxy.set_event_live_url(body);
            //     break;
        }
    }
}
