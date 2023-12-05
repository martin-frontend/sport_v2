import AbstractMediator from "@/core/abstract/AbstractMediator";
import NavigationProxy from "../proxy/NavigationProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

export default class NavigationMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [
            // net.EventType.api_menu_subnav,
            net.EventType.api_user_lovematch,
            // net.EventType.api_menu_subnav_country,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: NavigationProxy = getProxy(NavigationProxy);
        switch (notification.getName()) {
            // case net.EventType.api_menu_subnav:
            //     myProxy.set_menu_subnav(body);
            //     break;
            case net.EventType.api_user_lovematch:
                myProxy.set_user_lovematch(body);
                break;
            // case net.EventType.api_menu_subnav_country:
            //     myProxy.set_menu_subnav_country(body, type);
            //     break;
        }
    }
}
