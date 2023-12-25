import AbstractMediator from "@/core/abstract/AbstractMediator";
import NavigationProxy from "../proxy/NavigationProxy";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import SelfProxy from "@/proxy/SelfProxy";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";
import Vue from "vue";
import PageRacingHomeProxy from "../../page_racing_home/proxy/PageRacingHomeProxy";
import SportUtil from "@/core/global/SportUtil";
import page_racing_home from "../../page_racing_home";
import page_home from "../../page_home";

export default class NavigationMediator extends AbstractMediator {
    public listNotificationInterests(): string[] {
        return [
            // net.EventType.api_menu_subnav,
            net.EventType.api_user_lovematch,
            // net.EventType.api_menu_subnav_country,
            net.EventType.api_menu_leftnav,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const myProxy: NavigationProxy = getProxy(NavigationProxy);
        const selfProxy: SelfProxy = getProxy(SelfProxy);
        const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
        const racingHomeProxy: PageRacingHomeProxy = getProxy(PageRacingHomeProxy);
        switch (notification.getName()) {
            // case net.EventType.api_menu_subnav:
            //     myProxy.set_menu_subnav(body);
            //     break;
            case net.EventType.api_user_lovematch:
                myProxy.set_user_lovematch(body);
                break;
            // case net.EventType.api_menu_subnav_country:
            //     myProxy.set_menu_subnav_country(body, type);
            //     break;

            case net.EventType.api_menu_leftnav:
                delete body.requestData;
                myProxy.pageData.new_menu_subnav = body;
                // 排序
                const entries = Object.entries(body);
                entries.sort((a: any, b: any) => {
                    return a[1].sort - b[1].sort;
                });
                myProxy.pageData.sportIdArr = [];
                entries.forEach((item: any) => {
                    myProxy.pageData.sportIdArr.push(Number(item[0]));
                });
                if (Vue.router.currentRoute.path == "/page_home") {
                    const sport_id = myProxy.pageData.sportIdArr[0];
                    const firstData = body[myProxy.pageData.sportIdArr[0]];
                    const inplay = firstData?.["inplay"];
                    const today = firstData?.["today"];

                    if (inplay?.num == 0) {
                        homeProxy.listQueryComp.tag = "today";
                        if (today?.num == 0) {
                            homeProxy.listQueryComp.tag = "future";
                        }
                    }
                    if (selfProxy.userInfo.user_setting.remark) {
                        try {
                            homeProxy.listQueryComp.sort = JSON.parse(selfProxy.userInfo.user_setting.remark).sort;
                        } catch (error) {
                            homeProxy.listQueryComp.sort = "comp";
                        }
                    }

                    page_home.showBySport(sport_id);
                }

                if (Vue.router.currentRoute.path == "/page_racing_home") {
                    const sport_id = myProxy.pageData.sportIdArr.find((sportId) => SportUtil.isRaceEvent(sportId));
                    if (sport_id) {
                        homeProxy.listQueryComp.sport_id = sport_id;
                        page_racing_home.showBySport(sport_id);
                    }
                }
                break;
        }
    }
}
