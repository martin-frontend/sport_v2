import AbstractMediator from "@/core/abstract/AbstractMediator";
import MyBetProxy from "../proxy/MyBetProxy";
import getProxy from "@/core/global/getProxy";

export default class MyBetMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: MyBetProxy = getProxy(MyBetProxy);
        switch (notification.getName()) {
        }
    }
}
