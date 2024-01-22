import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageRaceResultsProxy from "../proxy/PageRaceResultsProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import GlobalVar from "@/core/global/GlobalVar";

export default class PageRaceResultsMediator extends AbstractMediator {
    public onRemove(): void {
        this.facade.removeProxy(this.mediatorName);
    }

    public listNotificationInterests(): string[] {
        return [net.EventType.api_event_states, net.EventType.api_market_typelist];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: PageRaceResultsProxy = <any>puremvc.Facade.getInstance().retrieveProxy(this.mediatorName);

        const type = notification.getType();
        switch (notification.getName()) {
            case net.EventType.api_event_states:
                if (type == "raceResult" && body[0].event_id == this.mediatorName) {
                    GlobalVar.loading = false;
                    myProxy.set_api_event_states(body);
                }
                break;
            case net.EventType.api_market_typelist:
                if (type == "raceResult" && body[0].event_id == this.mediatorName) {
                    GlobalVar.loading = false;
                    myProxy.set_api_market_typelist(body);
                }
                break;
        }
    }
}
