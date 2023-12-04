import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageRacingDetailProxy from "../proxy/PageRacingDetailProxy";
import getProxy from "@/core/global/getProxy";

export default class PageRacingDetailMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:PageRacingDetailProxy = getProxy(PageRacingDetailProxy);
        switch(notification.getName()){}
    }
}