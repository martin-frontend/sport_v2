import AbstractMediator from "@/core/abstract/AbstractMediator";
import LivePlayer from "../proxy/LivePlayerProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

export default class LivePlayerMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [net.EventType.api_event_list, net.EventType.api_event_states];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: LivePlayer = getProxy(LivePlayer);
        switch (notification.getName()) {
            case net.EventType.api_event_list:
                if (type == LivePlayer.NAME) {
                    myProxy.set_event_list(body);
                }
                break;
            case net.EventType.api_event_states:
                if (type == LivePlayer.NAME) {
                    myProxy.set_event_states(body);
                }
                break;
        }
    }
}
