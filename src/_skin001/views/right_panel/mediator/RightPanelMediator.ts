import AbstractMediator from "@/core/abstract/AbstractMediator";
import RightPanelProxy from "../proxy/RightPanelProxy";
import getProxy from "@/core/global/getProxy";

export default class RightPanelMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:RightPanelProxy = getProxy(RightPanelProxy);
        switch(notification.getName()){}
    }
}