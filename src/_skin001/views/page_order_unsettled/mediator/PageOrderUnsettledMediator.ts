import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageOrderUnsettledProxy from "../proxy/PageOrderUnsettledProxy";
import getProxy from "@/core/global/getProxy";

export default class PageOrderUnsettledMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:PageOrderUnsettledProxy = getProxy(PageOrderUnsettledProxy);
        switch(notification.getName()){}
    }
}