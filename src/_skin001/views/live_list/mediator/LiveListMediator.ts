import AbstractMediator from "@/core/abstract/AbstractMediator";
import LiveListProxy from "../proxy/LiveListProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

export default class LiveListMediator extends AbstractMediator {
    public onRemove(): void {
        this.facade.removeProxy(LiveListProxy.NAME);
    }

    public listNotificationInterests(): string[] {
        return [net.EventType.api_event_live_list, net.EventType.api_event_states];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: LiveListProxy = getProxy(LiveListProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_live_list:
                myProxy.set_event_live_list(body);
                break;
            case net.EventType.api_event_states:
                if (type == LiveListProxy.NAME) {
                    myProxy.set_event_states(body);
                }
                break;
        }
    }
}
