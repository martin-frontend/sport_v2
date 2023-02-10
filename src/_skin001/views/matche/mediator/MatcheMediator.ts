import Vue from "vue";
import AbstractMediator from "@/core/abstract/AbstractMediator";
import MatcheProxy from "../proxy/MatcheProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import live from "../../live";
import matche from "..";
import dialog_message_box from "../../dialog_message_box";
import LangUtil from "@/core/global/LangUtil";
import page_home from "../../page_home";

export default class MatcheMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [net.EventType.api_event_list, net.EventType.api_market_typelist];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: MatcheProxy = getProxy(MatcheProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_list:
                if (body.length > 0 && !myProxy.listQueryComp.event_id) {
                    const event_id = body[0].matches[0].id;
                    matche.init(event_id);
                    live.init(event_id);
                }
                if (type == MatcheProxy.NAME) {
                    myProxy.set_event_list(body);
                    if(body.length == 0){
                        dialog_message_box.alert({
                            message: LangUtil("赛事不存在"),
                            okFun: () => {
                                page_home.show();
                                page_home.showEventList();
                                myProxy.listQueryComp.event_id = "";
                                myProxy.pageData.market_list = [];
                            },
                        });
                    }
                }
                break;
            case net.EventType.api_market_typelist:
                if (type == MatcheProxy.NAME) myProxy.set_market_typelist(body);
                break;
        }
    }
}
