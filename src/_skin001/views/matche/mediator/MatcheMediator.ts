import AbstractMediator from "@/core/abstract/AbstractMediator";
import MatcheProxy from "../proxy/MatcheProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import live from "../../live";
import matche from "..";

export default class MatcheMediator extends AbstractMediator{
    public listNotificationInterests(): string[] {
        return [
            net.EventType.api_event_list,
            net.EventType.api_market_typelist,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: MatcheProxy = getProxy(MatcheProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_list:
                if(body.length > 0 && !myProxy.listQueryComp.event_id){
                    const event_id = body[0].matches[0].id;
                    matche.init(event_id);
                    live.init(event_id);
                }
                if(type == MatcheProxy.NAME){
                    myProxy.set_event_list(body);
                }
                break;
            case net.EventType.api_market_typelist:
                if (type == MatcheProxy.NAME) myProxy.set_market_typelist(body);
                break;
        }
    }
}