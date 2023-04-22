import AbstractMediator from "@/core/abstract/AbstractMediator";
import DialogMessageBoxProxy from "../proxy/DialogMessageBoxProxy";
import getProxy from "@/core/global/getProxy";

export default class DialogMessageBoxMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: DialogMessageBoxProxy = getProxy(DialogMessageBoxProxy);
        // switch(notification.getName()){}
    }
}
