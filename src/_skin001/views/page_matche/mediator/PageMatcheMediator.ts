import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageMatcheProxy from "../proxy/PageMatcheProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";

export default class PageMatcheMediator extends AbstractMediator{

    public onRemove(): void {
        this.facade.removeProxy(PageMatcheProxy.NAME);
    }

    public listNotificationInterests(): string[] {
        return [net.EventType.api_event_list];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy:PageMatcheProxy = getProxy(PageMatcheProxy);
        switch(notification.getName()){
            case net.EventType.api_event_list:
                    if(type == PageMatcheProxy.NAME){
                        myProxy.set_event_list(body);
                    }
                break;
        }
    }
}