import AbstractMediator from "@/core/abstract/AbstractMediator";
import DialogSettingProxy from "../proxy/DialogSettingProxy";
import getProxy from "@/core/global/getProxy";

export default class DialogSettingMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:DialogSettingProxy = getProxy(DialogSettingProxy);
        switch(notification.getName()){}
    }
}