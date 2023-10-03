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
import OrderTitleUtils from "@/core/global/OrderTitleUtils";

export default class DialogBetResultMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [net.EventType.api_user_betfix, net.EventType.api_user_pending, net.EventType.api_user_betfix_v3];
    }
    //赛事进程
    getStats(market_type: any, states: any) {
        return `${OrderTitleUtils.getScoreStr({
            market_type: market_type,
            state: states,
        })}`;
    }
    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const myProxy: DialogBetResultProxy = getProxy(DialogBetResultProxy);
        const betProxy: BetProxy = getProxy(BetProxy);
        switch (notification.getName()) {
            // case net.EventType.api_user_betfix:
            //     myProxy.pageData.bShow = true;
            //     myProxy.pageData.status = body.status;
            //     myProxy.pageData.order_no = body.order_no;
            //     myProxy.pageData.partner_order = body.partner_order;
            //     Object.assign(myProxy.pageData, body.requestData);
            //     myProxy.pageData.odds = body.odds;
            //     myProxy.pageData.create_time = GlobalVar.server_time;
            //     myProxy.pageData.isInPlay = false;
            //     myProxy.pageData.goals = "";
            //     if (this.matche && this.matche.c_type != 2) {
            //         myProxy.pageData.states_str = "";
            //         const betProxy: BetProxy = getProxy(BetProxy);
            //         const states = betProxy.pageData.event_states.find((item) => item.event_id == myProxy.pageData.event_id);
            //         if (states && states.phase_minute > 0) {
            //             myProxy.pageData.isInPlay = true;
            //             // myProxy.pageData.goals = states.goals_ft;
            //             myProxy.pageData.goals = this.getStats(body.requestData.market_type, states);
            //             // data.states_str = LangUtil("已开赛");
            //             if (states.match_phase) {
            //                 myProxy.pageData.states_str += " " + LangUtil(states.match_phase);
            //             }
            //             if (states.phase_minute > 0) {
            //                 myProxy.pageData.states_str += " " + states.phase_minute + LangUtil("分钟");
            //             }
            //         } else {
            //             if (states) {
            //                 if (states.match_phase !== "-") {
            //                     myProxy.pageData.states_str += " " + LangUtil(states.match_phase);
            //                 } else {
            //                     myProxy.pageData.states_str += LangUtil("即将开赛");
            //                 }
            //             } else {
            //                 const start_in_sec = this.matche.sb_time - GlobalVar.server_time;
            //                 const day = Math.floor(start_in_sec / 60 / 60 / 24);
            //                 const hr = Math.floor(start_in_sec / 60 / 60);
            //                 const min = Math.floor((start_in_sec / 60) % 60);
            //                 if (start_in_sec > 0) {
            //                     myProxy.pageData.states_str = dateFormat(
            //                         getDateByTimeZone(this.matche.sb_time * 1000, GlobalVar.zone),
            //                         "MM-dd hh:mm"
            //                     );
            //                     if (start_in_sec > 86400) {
            //                         myProxy.pageData.states_str += " " + LangUtil("距开赛") + " " + day + LangUtil("天");
            //                     } else if (start_in_sec > 600) {
            //                         myProxy.pageData.states_str +=
            //                             " " + LangUtil("距开赛") + " " + hr + LangUtil("小时") + min + LangUtil("分");
            //                     } else {
            //                         myProxy.pageData.states_str += LangUtil("即将开赛");
            //                     }
            //                 }
            //             }
            //         }
            //     }
            //     break;
            // case net.EventType.api_user_pending:
            //     for (const item of body) {
            //         // console.warn(">>>>>>", item);
            //         if (item.partner_order == myProxy.pageData.partner_order) {
            //             myProxy.pageData.status = item.status;
            //             myProxy.pageData.statusMsg = item.statusMsg;
            //             myProxy.pageData.order_no = item.order_no;
            //             myProxy.pageData.odds = item.odds;
            //         }
            //         Vue.notify(<any>{
            //             group: "order_finished",
            //             // duration: -1,
            //             duration: item.status == 0 || item.status == 1 ? 3000 : -1,
            //             data: item,
            //         });
            //     }
            //     break;
            case net.EventType.api_user_pending:
                for (const item of body) {
                    let { parlayData } = myProxy.pageData;
                    // 串关
                    if (betProxy.pageData.betType == "parlay") {
                        Object.assign(parlayData, item);
                    } else {
                        const listData = myProxy.pageData.list.find(({ partner_order }: any) => partner_order == item.partner_order);
                        if (listData) {
                            listData.status = item.status;
                            listData.statusMsg = item.statusMsg;
                            listData.order_no = item.order_no;
                            if(item.odds) {
                                listData.odds = item.odds;
                            }
                        }
                    }
                    // Vue.notify(<any>{
                    //     group: "order_finished",
                    //     // duration: -1,
                    //     duration: item.status == 0 || item.status == 1 ? 3000 : -1,
                    //     data: item,
                    // });
                    this.finshedOrders.push(item);
                }

                this.showFinshedOrdersTips();
                break;
            case net.EventType.api_user_betfix_v3:
                myProxy.pageData.bShow = true;
                myProxy.pageData.list.length = 0;
                const keys = Object.keys(body);

                keys.forEach((key) => {
                    if (key === "requestData") {
                        myProxy.pageData.requestData = JSON.parse(JSON.stringify(body["requestData"]));
                        return;
                    }

                    if (body.requestData.bet_type == "single") {
                        if (!key.includes(betProxy.pageData.listIdName)) {
                            return;
                        }
                        const data: any = {};
                        Object.assign(data, body[key]);
                        data.leg_id = key;
                        this.initData(data);
                        myProxy.pageData.list.push(data);
                    } else {
                        myProxy.pageData.parlayData.states_str = GlobalVar.server_time;
                        if (key != "legs") {
                            Object.assign(myProxy.pageData.parlayData, {
                                [key]: body[key],
                            });
                            return;
                        } else {
                            const legKeys = Object.keys(body["legs"]);
                            legKeys.forEach((legKey) => {
                                const data: any = {};
                                Object.assign(data, body["legs"][legKey]);
                                data.leg_id = legKey;
                                this.initData(data);
                                myProxy.pageData.list.push(data);
                                myProxy.pageData.parlayData.create_time = data.create_time;
                            });
                            this.sortBySbTime(myProxy.pageData.list);
                        }
                    }
                });
                break;
        }
    }

    // get matche(): any {
    //     const myProxy: DialogBetResultProxy = getProxy(DialogBetResultProxy);
    //     const matcheProxy: MatcheProxy = getProxy(MatcheProxy);
    //     for (const comp of matcheProxy.pageData.competition_list) {
    //         for (const matche of comp.matches) {
    //             if (matche.id == myProxy.pageData.event_id) {
    //                 return matche;
    //             }
    //         }
    //     }
    //     const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    //     for (const comp of homeProxy.pageData.competition_list) {
    //         for (const matche of comp.matches) {
    //             if (matche.id == myProxy.pageData.event_id) {
    //                 return matche;
    //             }
    //         }
    //     }
    //     return null;
    // }

    initData(data: any) {
        data.create_time = GlobalVar.server_time;
        data.isInPlay = false;
        data.goals = "";
        data.states_str = "";
        const { market, matche, selection, comp, stake } = this.getBetItem(data.market_id, data.selection_id);
        data.market = market;
        data.matche = matche;
        data.selection = selection;
        data.comp = comp;
        data.stake = stake;
        if (matche && matche.c_type != 2) {
            const betProxy: BetProxy = getProxy(BetProxy);
            const states = betProxy.pageData.event_states.find((item) => item.event_id == data.event_id);
            if (states && states.phase_minute > 0) {
                data.isInPlay = true;
                data.goals = this.getStats(data.market.market_type, states);
                if (states.match_phase) {
                    data.states_str += " " + LangUtil(states.match_phase);
                }
                if (states.phase_minute > 0) {
                    data.states_str += " " + states.phase_minute + LangUtil("分钟");
                } else {
                    if (states) {
                        if (states.match_phase !== "-") {
                            data.states_str += " " + LangUtil(states.match_phase);
                        } else {
                            data.states_str += LangUtil("即将开赛");
                        }
                    } else {
                        const start_in_sec = matche.sb_time - GlobalVar.server_time;
                        const day = Math.floor(start_in_sec / 60 / 60 / 24);
                        const hr = Math.floor(start_in_sec / 60 / 60);
                        const min = Math.floor((start_in_sec / 60) % 60);
                        if (start_in_sec > 0) {
                            data.states_str = dateFormat(getDateByTimeZone(matche.sb_time * 1000, GlobalVar.zone), "MM-dd hh:mm");
                            if (start_in_sec > 86400) {
                                data.states_str += " " + LangUtil("距开赛") + " " + day + LangUtil("天");
                            } else if (start_in_sec > 600) {
                                data.states_str += " " + LangUtil("距开赛") + " " + hr + LangUtil("小时") + min + LangUtil("分");
                            } else {
                                data.states_str += LangUtil("即将开赛");
                            }
                        }
                    }
                }
            }
        }
    }

    getBetItem(market_id: any, selection_id: any) {
        const betProxy: BetProxy = getProxy(BetProxy);
        const findItem = betProxy.pageData.bettedList.find(
            (item) => item.market.market_id == market_id && item.selection.id == selection_id
        );
        const newFindItem = JSON.parse(JSON.stringify(findItem));
        return newFindItem;
    }

    finshedOrders: any = [];
    timeId: any = null;
    async showFinshedOrdersTips() {
        if (this.timeId || this.finshedOrders.length === 0) return;
        const arr = this.finshedOrders.splice(0, 3);
        arr.forEach((item: any) => {
            Vue.notify(<any>{
                group: "order_finished",
                // duration: -1,
                duration: item.status == 0 || item.status == 1 ? 3000 : -1,
                data: item,
            });
        });
        this.timeId = setTimeout(() => {
            clearTimeout(this.timeId);
            this.timeId = null;
            this.showFinshedOrdersTips();
        }, 4000);
    }

    sortBySbTime(data: any) {
        data.sort((a: any, b: any) => {
            return a.matche?.sb_time - b.matche?.sb_time;
        });
    }
}
