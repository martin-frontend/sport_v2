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
            net.EventType.api_event_live_url,
            net.EventType.api_event_hot,
            net.EventType.api_event_market_type_v2,
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
                    live.show(event_id);
                }
                if(type == PageMatcheProxy.NAME){
                    myProxy.set_event_list(body);
                }
                // if (type == "matche" && Vue.vuetify.breakpoint.mobile) {
                //     if (body.length == 0) {
                //         Vue.router.replace("/page_home");
                //         GlobalVar.loading = false;
                //     } else {
                        // myProxy.set_event_list(body);
                //     }
                // }else if(type == "matche_competition"){
                //     GlobalVar.loading = false;
                //     myProxy.set_event_competition_list(body);
                // }
                break;
            case net.EventType.api_market_typelist:
                if (type == PageMatcheProxy.NAME) myProxy.set_market_typelist(body);
                break;
            case net.EventType.api_event_states:
                if (type == PageMatcheProxy.NAME) myProxy.set_event_states(body);
                break;
            case net.EventType.api_event_live_url:
                myProxy.set_liveUrl(body);
                break;
            case net.EventType.api_event_hot:
                myProxy.set_event_hot(body);
                break;
            case net.EventType.api_event_market_type_v2:
                myProxy.updateMarketTypeOptions();
                break;
        }
    }
}