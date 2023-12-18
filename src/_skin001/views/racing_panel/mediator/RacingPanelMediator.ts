import AbstractMediator from "@/core/abstract/AbstractMediator";
import RacingPanelProxy from "../proxy/RacingPanelProxy";
import getProxy from "@/core/global/getProxy";

export default class RacingPanelMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:RacingPanelProxy = getProxy(RacingPanelProxy);
        switch(notification.getName()){}
    }
}