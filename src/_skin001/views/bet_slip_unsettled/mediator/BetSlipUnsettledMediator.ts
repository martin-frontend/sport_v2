import AbstractMediator from "@/core/abstract/AbstractMediator";
import BetSlipUnsettledProxy from "../proxy/BetSlipUnsettledProxy";
import getProxy from "@/core/global/getProxy";

export default class BetSlipUnsettledMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy:BetSlipUnsettledProxy = getProxy(BetSlipUnsettledProxy);
        switch(notification.getName()){}
    }
}