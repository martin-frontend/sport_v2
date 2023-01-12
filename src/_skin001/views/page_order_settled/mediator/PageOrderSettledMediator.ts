import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageOrderSettledProxy from "../proxy/PageOrderSettledProxy";
import getProxy from "@/core/global/getProxy";

export default class PageOrderSettledMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:PageOrderSettledProxy = getProxy(PageOrderSettledProxy);
        switch(notification.getName()){}
    }
}