import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageHomeProxy from "../proxy/PageHomeProxy";
import getProxy from "@/core/global/getProxy";

export default class PageHomeMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:PageHomeProxy = getProxy(PageHomeProxy);
        switch(notification.getName()){}
    }
}