import AbstractMediator from "@/core/abstract/AbstractMediator";
import DialogConfirmSettlementProxy from "../proxy/DialogConfirmSettlementProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

export default class DialogConfirmSettlementMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [net.EventType.api_user_precashout];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: DialogConfirmSettlementProxy = getProxy(DialogConfirmSettlementProxy);
        // switch(notification.getName()){}
        switch (notification.getName()) {
            case net.EventType.api_user_precashout:
                myProxy.set_cashout(body);
                break;
        }
    }
}
