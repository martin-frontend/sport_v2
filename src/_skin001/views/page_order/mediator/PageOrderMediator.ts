import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageOrderProxy from "../proxy/PageOrderProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

export default class PageOrderMediator extends AbstractMediator {
    public onRemove(): void {
        this.facade.removeProxy(PageOrderProxy.NAME);
    }

    public listNotificationInterests(): string[] {
        return [net.EventType.api_user_orders, net.EventType.api_event_states, net.EventType.api_user_orders_v3];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: PageOrderProxy = getProxy(PageOrderProxy);
        const type = notification.getType();
        switch (notification.getName()) {
            case net.EventType.api_user_orders:
                myProxy.set_user_orders(body);
                break;
            case net.EventType.api_event_states:
                if (type == PageOrderProxy.NAME) myProxy.set_event_states(body);
                break;
            case net.EventType.api_user_orders_v3:
                myProxy.set_user_orders(body);
                break;
        }
    }
}
