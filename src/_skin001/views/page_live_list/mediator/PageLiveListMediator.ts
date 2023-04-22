import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageLiveListProxy from "../proxy/PageLiveListProxy";
import getProxy from "@/core/global/getProxy";

export default class PageLiveListMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: PageLiveListProxy = getProxy(PageLiveListProxy);
        switch (notification.getName()) {
        }
    }
}
