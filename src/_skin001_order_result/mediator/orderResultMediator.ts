import AbstractMediator from "@/core/abstract/AbstractMediator";
import orderResultProxy from "../proxy/orderResultProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

import GlobalVar from "@/core/global/GlobalVar";
export default class OrderResultMediator extends AbstractMediator {
    public onRemove(): void {
        this.facade.removeProxy(orderResultProxy.NAME);
    }
    public listNotificationInterests(): string[] {
        return [
            net.EventType.api_user_orders,
            net.EventType.public_plat_config,
            net.EventType.api_user_orders_v3,
            net.EventType.api_event_sports,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: orderResultProxy = getProxy(orderResultProxy);
        switch (notification.getName()) {
            case net.EventType.api_user_orders:
                myProxy.set_user_orders(body);
                break;
            case net.EventType.public_plat_config:
                myProxy.set_public_plat_config(body);
                break;
            case net.EventType.api_user_orders_v3:
                myProxy.set_user_orders(body);
                break;
            case net.EventType.api_event_sports:
                myProxy.setSportTagData(body);
                break;
        }
    }
}
