import Vue from "vue";
import AbstractMediator from "@/core/abstract/AbstractMediator";
import DialogBetResultProxy from "../proxy/DialogBetResultProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import GlobalVar from "@/core/global/GlobalVar";
import BetProxy from "@/proxy/BetProxy";
import { dateFormat, getDateByTimeZone, getResponseIcon } from "@/core/global/Functions";
import LangUtil from "@/core/global/LangUtil";
import MatcheProxy from "../../matche/proxy/MatcheProxy";
import Matche from "../../matche/views/Matche";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";

export default class DialogBetResultMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [net.EventType.api_user_betfix, net.EventType.api_user_pending];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: DialogBetResultProxy = getProxy(DialogBetResultProxy);
        switch (notification.getName()) {
            case net.EventType.api_user_betfix:
                myProxy.pageData.bShow = true;
                myProxy.pageData.status = body.status;
                myProxy.pageData.order_no = body.order_no;
                Object.assign(myProxy.pageData, body.requestData);
                myProxy.pageData.create_time = GlobalVar.server_time;
                myProxy.pageData.isInPlay = false;
                myProxy.pageData.goals = "";
                if (this.matche && this.matche.c_type != 2) {
                    myProxy.pageData.states_str = "";
                    const betProxy: BetProxy = getProxy(BetProxy);
                    const states = betProxy.pageData.event_states.find((item) => item.event_id == myProxy.pageData.event_id);
                    if (states && states.phase_minute > 0) {
                        myProxy.pageData.isInPlay = true;
                        myProxy.pageData.goals = states.goals_ft;
                        // data.states_str = LangUtil("已开赛");
                        if (states.match_phase) {
                            myProxy.pageData.states_str += " " + LangUtil(states.match_phase);
                        }
                        if (states.phase_minute > 0) {
                            myProxy.pageData.states_str += " " + states.phase_minute + LangUtil("分钟");
                        }
                    } else {
                        if (states) {
                            if (states.match_phase !== "-") {
                                myProxy.pageData.states_str += " " + LangUtil(states.match_phase);
                            } else {
                                myProxy.pageData.states_str += LangUtil("即将开赛");
                            }
                        } else {
                            const start_in_sec = this.matche.sb_time - GlobalVar.server_time;
                            const day = Math.floor(start_in_sec / 60 / 60 / 24);
                            const hr = Math.floor(start_in_sec / 60 / 60);
                            const min = Math.floor((start_in_sec / 60) % 60);
                            if (start_in_sec > 0) {
                                myProxy.pageData.states_str = dateFormat(
                                    getDateByTimeZone(this.matche.sb_time * 1000, GlobalVar.zone),
                                    "MM-dd hh:mm"
                                );
                                if (start_in_sec > 86400) {
                                    myProxy.pageData.states_str += " " + LangUtil("距开赛") + " " + day + LangUtil("天");
                                } else if (start_in_sec > 600) {
                                    myProxy.pageData.states_str +=
                                        " " + LangUtil("距开赛") + " " + hr + LangUtil("小时") + min + LangUtil("分");
                                } else {
                                    myProxy.pageData.states_str += LangUtil("即将开赛");
                                }
                            }
                        }
                    }
                }
                break;
            case net.EventType.api_user_pending:
                for (const item of body) {
                    // console.warn(">>>>>>", item);
                    if (item.order_no == myProxy.pageData.order_no) {
                        myProxy.pageData.status = item.status;
                        myProxy.pageData.statusMsg = item.statusMsg;
                    }
                    Vue.notify(<any>{
                        group: "order_finished",
                        // duration: -1,
                        duration: item.status == 0 || item.status == 1 ? 3000 : -1,
                        data: item,
                    });
                }
                break;
        }
    }

    get matche(): any {
        const myProxy: DialogBetResultProxy = getProxy(DialogBetResultProxy);
        const matcheProxy: MatcheProxy = getProxy(MatcheProxy);
        for (const comp of matcheProxy.pageData.competition_list) {
            for (const matche of comp.matches) {
                if (matche.id == myProxy.pageData.event_id) {
                    return matche;
                }
            }
        }
        const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
        for (const comp of homeProxy.pageData.competition_list) {
            for (const matche of comp.matches) {
                if (matche.id == myProxy.pageData.event_id) {
                    return matche;
                }
            }
        }
        return null;
    }
}
