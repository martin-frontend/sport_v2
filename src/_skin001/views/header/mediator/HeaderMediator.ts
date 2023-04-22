import AbstractMediator from "@/core/abstract/AbstractMediator";
import HeaderProxy from "../proxy/HeaderProxy";
import getProxy from "@/core/global/getProxy";

export default class HeaderMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: HeaderProxy = getProxy(HeaderProxy);
        switch (notification.getName()) {
        }
    }
}
