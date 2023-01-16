import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageMatcheProxy from "../proxy/PageMatcheProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import Vue from "vue";
import GlobalVar from "@/core/global/GlobalVar";
import live from "../../live";

export default class PageMatcheMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [
            net.EventType.api_event_list,
            net.EventType.api_market_typelist,
            net.EventType.api_event_states,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: PageMatcheProxy = getProxy(PageMatcheProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_list:
                if(body.length > 0 && !myProxy.listQueryComp.event_id){
                    const event_id = body[0].matches[0].id;
                    myProxy.init(event_id);
                    live.init(event_id);
                }
                if(type == PageMatcheProxy.NAME){
                    myProxy.set_event_list(body);
                }
                break;
            case net.EventType.api_market_typelist:
                if (type == PageMatcheProxy.NAME) myProxy.set_market_typelist(body);
                break;
            case net.EventType.api_event_states:
                if (type == PageMatcheProxy.NAME) myProxy.set_event_states(body);
                break;
        }
    }
}