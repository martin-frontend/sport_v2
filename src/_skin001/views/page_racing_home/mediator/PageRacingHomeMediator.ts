import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageRacingHomeProxy from "../proxy/PageRacingHomeProxy";
import getProxy from "@/core/global/getProxy";

export default class PageRacingHomeMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:PageRacingHomeProxy = getProxy(PageRacingHomeProxy);
        switch(notification.getName()){}
    }
}