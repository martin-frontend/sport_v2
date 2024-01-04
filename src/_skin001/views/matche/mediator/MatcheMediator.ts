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
import GlobalVar from "@/core/global/GlobalVar";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";

export default class MatcheMediator extends AbstractMediator {
    public onRemove(): void {
        this.facade.removeProxy(MatcheProxy.NAME);
    }
    public listNotificationInterests(): string[] {
        return [net.EventType.api_event_list_v3, net.EventType.api_market_typelist, net.EventType.api_event_market_type_v2];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: MatcheProxy = getProxy(MatcheProxy);
        switch (notification.getName()) {
            case net.EventType.api_event_list_v3:
                if (body.length > 0 && !myProxy.listQueryComp.event_id) {
                    if (GlobalVar.pre_event_id) {
                        matche.init(GlobalVar.pre_event_id);
                        live.init(GlobalVar.pre_event_id);
                    }
                }
                if (type == PageHomeProxy.NAME) {
                    const event_id = body[0]?.matches[0]?.id;
                    matche.init(event_id);
                }
                if (type == MatcheProxy.NAME) {
                    myProxy.set_event_list(body);
                    if (body.length == 0) {
                        // dialog_message_box.alert({
                        //     message: LangUtil("该赛事不存在或已结束"),
                        //     okFun: () => {
                        //         page_home.show();
                        //         page_home.showEventList();
                        //         myProxy.listQueryComp.event_id = "";
                        //         myProxy.pageData.market_list = [];
                        //     },
                        // });
                    }
                }
                break;
            case net.EventType.api_market_typelist:
                if (type == MatcheProxy.NAME) myProxy.set_market_typelist(body);
                break;
            case net.EventType.api_event_market_type_v2:
                myProxy.set_event_market_type_v2(body);
                break;
        }
    }
}
