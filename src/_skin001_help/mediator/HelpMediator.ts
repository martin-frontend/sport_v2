import AbstractMediator from "@/core/abstract/AbstractMediator";
import HelpProxy from "../proxy/HelpProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import GlobalVar from "@/core/global/GlobalVar";

export default class HelpMediator extends AbstractMediator {
    public onRegister(): void {
        this.facade.removeProxy(HelpProxy.NAME);
    }

    public listNotificationInterests(): string[] {
        return [net.EventType.api_helpcenter_list];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: HelpProxy = getProxy(HelpProxy);
        switch (notification.getName()) {
            case net.EventType.api_helpcenter_list:
                GlobalVar.loading = false;
                myProxy.set_helpcenter_list(body);
                break;
        }
    }
}
