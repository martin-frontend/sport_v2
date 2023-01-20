import AbstractMediator from "@/core/abstract/AbstractMediator";
import DialogMyBetProxy from "../proxy/DialogMyBetProxy";
import getProxy from "@/core/global/getProxy";

export default class DialogMyBetMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:DialogMyBetProxy = getProxy(DialogMyBetProxy);
        switch(notification.getName()){}
    }
}