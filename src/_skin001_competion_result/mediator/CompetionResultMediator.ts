import AbstractMediator from "@/core/abstract/AbstractMediator";
import CompetionResultProxy from "../proxy/CompetionResultProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

import GlobalVar from "@/core/global/GlobalVar";
export default class CompetionResultMediator extends AbstractMediator {
    public onRemove(): void {
        this.facade.removeProxy(CompetionResultProxy.NAME);
    }
    public listNotificationInterests(): string[] {
        return [
            net.EventType.api_event_result,
            net.EventType.public_plat_config
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: CompetionResultProxy = getProxy(CompetionResultProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_result:
                myProxy.set_envent_result(body);
                break;
            case net.EventType.public_plat_config:
                myProxy.set_public_plat_config(body);
                break;
        }
    }
}
