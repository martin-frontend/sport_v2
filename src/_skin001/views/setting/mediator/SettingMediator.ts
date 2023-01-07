import AbstractMediator from "@/core/abstract/AbstractMediator";
import SettingProxy from "../proxy/SettingProxy";
import getProxy from "@/core/global/getProxy";

export default class SettingMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:SettingProxy = getProxy(SettingProxy);
        switch(notification.getName()){}
    }
}