import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageGameResultsProxy from "../proxy/PageGameResultsProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import GlobalVar from "@/core/global/GlobalVar";

export default class PageGameResultsMediator extends AbstractMediator {
    public onRemove(): void {
        this.facade.removeProxy(this.mediatorName);
    }

    public listNotificationInterests(): string[] {
        return [net.EventType.api_event_states];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: PageGameResultsProxy = <any>puremvc.Facade.getInstance().retrieveProxy(this.mediatorName);

        const type = notification.getType();
        switch (notification.getName()) {
            case net.EventType.api_event_states:
                if (type == "result" && body[0].event_id == this.mediatorName) {
                    GlobalVar.loading = false;
                    myProxy.set_api_event_states(body);
                }
                break;
        }
    }
}
