import AbstractMediator from "@/core/abstract/AbstractMediator";
import PageHomeProxy from "../proxy/PageHomeProxy";
import getProxy from "@/core/global/getProxy";
import SelfProxy from "@/proxy/SelfProxy";
import net from "@/net/setting";
import GlobalVar from "@/core/global/GlobalVar";
import MatcheProxy from "../../matche/proxy/MatcheProxy";

export default class PageHomeMediator extends AbstractMediator {
    onRegister() {
        const myProxy: PageHomeProxy = getProxy(PageHomeProxy);
        // GlobalVar.loading = true;
        // myProxy.api_menu_subnav();
        // myProxy.api_menu_leftnav();
        myProxy.api_event_list();
    }

    public listNotificationInterests(): string[] {
        return [
            net.EventType.api_event_list_v3,
            net.EventType.api_market_typelist,
            net.EventType.api_event_states,
            net.EventType.api_user_lovematch,
            net.EventType.api_user_love,
            // net.EventType.api_menu_subnav,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: PageHomeProxy = getProxy(PageHomeProxy);
        const selfProxy: SelfProxy = getProxy(SelfProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_list_v3:
                if (type == PageHomeProxy.NAME) {
                    myProxy.set_event_list(body);
                }
                break;
            case net.EventType.api_market_typelist:
                if (type == PageHomeProxy.NAME) {
                    myProxy.set_market_typelist(body);
                } else if (type == MatcheProxy.NAME) {
                    myProxy.updateMarketCount(body);
                }
                break;
            case net.EventType.api_event_states:
                if (type == PageHomeProxy.NAME) {
                    myProxy.set_event_states(body);
                }
                break;
            case net.EventType.api_user_lovematch:
                if (type == <any>myProxy.pageData.lovematch_order) {
                    myProxy.set_user_lovematch(body);
                }
                break;
            case net.EventType.api_user_love:
                myProxy.api_user_lovematch();
                break;
            // case net.EventType.api_menu_subnav:
            //     {
            //         myProxy.pageData.menu_subnav.top = body.top;
            //         myProxy.pageData.menu_subnav.center = body.center;
            //         if (myProxy.isFirstRequest) {
            //             myProxy.isFirstRequest = false;
            //             const { top } = myProxy.pageData.menu_subnav;
            //             const inplay = top.find((item) => item.tag == "inplay");
            //             const today = top.find((item) => item.tag == "today");

            //             if (inplay?.num == 0) {
            //                 myProxy.listQueryComp.tag = "today";
            //                 if (today?.num == 0) {
            //                     myProxy.listQueryComp.tag = "future";
            //                 }
            //             }
            //             if (selfProxy.userInfo.user_setting.remark) {
            //                 try {
            //                     myProxy.listQueryComp.sort = JSON.parse(selfProxy.userInfo.user_setting.remark).sort;
            //                 } catch (error) {
            //                     myProxy.listQueryComp.sort = "comp";
            //                 }
            //             }

            //             myProxy.api_event_list();
            //         }
            //     }
            //     break;
        }
    }
}
