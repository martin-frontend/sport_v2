import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageMatcheProxy from "../proxy/PageMatcheProxy";
import getProxy from "@/core/global/getProxy";

export default class PageMatcheMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:PageMatcheProxy = getProxy(PageMatcheProxy);
        switch(notification.getName()){}
    }
}