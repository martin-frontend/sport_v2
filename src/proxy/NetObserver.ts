import AbstractMediator from "@/core/abstract/AbstractMediator";
import LangConfig from "@/core/config/LangConfig";
import PlatConfig from "@/core/config/PlatConfig";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import NotificationName from "@/core/NotificationName";
import net from "@/net/setting";
import BetProxy from "./BetProxy";
import OrderUnsettledProxy from "./OrderUnsettledProxy";
import SelfProxy from "./SelfProxy";
import SettingProxy from "./SettingProxy";

export default class NetObserver extends AbstractMediator {
    static NAME = "NetObserver";

    listNotificationInterests(): string[] {
        return [
            net.EventType.api_config,
            net.EventType.api_menu_lang,
            NotificationName.LANG_CONFIG,
            net.EventType.api_user_info,
            net.EventType.api_event_sports,
            net.EventType.api_event_market_type_v2,
            net.EventType.api_user_orders,

            net.EventType.api_market_typelist,
            net.EventType.api_event_states,
            net.EventType.api_user_set_user_setting,

            net.EventType.api_user_betfix,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
        const selfProxy: SelfProxy = this.getProxy(SelfProxy);
        const settingProxy: SettingProxy = getProxy(SettingProxy);
        switch (notification.getName()) {
            case net.EventType.api_config:
                PlatConfig.config = body;
                GlobalVar.plat_id = PlatConfig.config.client.plat_id;
                GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
                // 如果没有配置，给默认值
                if (!PlatConfig.config.client.pcMarketType) {
                    PlatConfig.config.client.pcMarketType =
                        "MATCH_ODDS,MATCH_ODDS_HALF_TIME,ASIAN_HANDICAP,ASIAN_HANDICAP_HALF_TIME,ASIAN_OVER_UNDER,ASIAN_OVER_UNDER_HALF_TIME";
                }
                if (!PlatConfig.config.client.h5MarketType) {
                    PlatConfig.config.client.h5MarketType = "ASIAN_OVER_UNDER,ASIAN_HANDICAP";
                }
                if (!PlatConfig.config.client.pcMarketType_extra) {
                    PlatConfig.config.client.pcMarketType_extra =
                        "ASIAN_HANDICAP_EXTRA_TIME,ASIAN_OVER_UNDER_EXTRA_TIME,ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME,ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME,ASIAN_HANDICAP_AFTER_PENALTIES,ASIAN_OVER_UNDER_AFTER_PENALTIES";
                }
                if (!PlatConfig.config.client.h5MarketType_extra) {
                    PlatConfig.config.client.h5MarketType_extra = "ASIAN_HANDICAP_EXTRA_TIME,ASIAN_OVER_UNDER_EXTRA_TIME";
                }
                if (!PlatConfig.config.client.champion_type) {
                    PlatConfig.config.client.champion_type = "RMM_OUTRIGHTS";
                }

                if (PlatConfig.config.client.isRecharge == undefined) {
                    PlatConfig.config.client.isRecharge = "0";
                }
                if (!PlatConfig.config.client.MarketType_area) {
                    PlatConfig.config.client.MarketType_area = "0";
                }

                LangConfig.load(GlobalVar.lang);
                break;
            case NotificationName.LANG_CONFIG:
                if (GlobalVar.token) {
                    this.facade.sendNotification(net.HttpType.api_user_info);
                    this.facade.sendNotification(net.HttpType.api_event_sports);
                    this.facade.sendNotification(net.HttpType.api_event_market_type_v2);
                    const orderUnsettledProxy: OrderUnsettledProxy = getProxy(OrderUnsettledProxy);
                    orderUnsettledProxy.api_user_orders();
                }
                break;
            case net.EventType.api_user_info:
                selfProxy.set_user_info(body);
                settingProxy.resetForm();
                //@ts-ignore
                window["vm"].$mount("#app");
                GlobalVar.loading = false;
                break;
            case net.EventType.api_event_sports:
                PlatConfig.allSprots = body;
                break;
            case net.EventType.api_event_market_type_v2:
                PlatConfig.allMarketType = body.market_type;
                PlatConfig.market_main_type = body.market_main_type;
                break;
            case net.EventType.api_market_typelist:
                if (type == BetProxy.NAME) {
                    const betProxy: BetProxy = getProxy(BetProxy);
                    betProxy.set_market_typelist(body);
                }
                break;
            case net.EventType.api_event_states:
                if (type == BetProxy.NAME) {
                    const betProxy: BetProxy = getProxy(BetProxy);
                    betProxy.set_event_states(body);
                }
                if (type == OrderUnsettledProxy.NAME) {
                    const orderUnsettledProxy: OrderUnsettledProxy = getProxy(OrderUnsettledProxy);
                    orderUnsettledProxy.set_event_states(body);
                }
                break;
            case net.EventType.api_user_set_user_setting:
                selfProxy.api_user_info();
                break;
            case net.EventType.api_user_orders:
                if (type == OrderUnsettledProxy.NAME) {
                    const orderUnsettledProxy: OrderUnsettledProxy = getProxy(OrderUnsettledProxy);
                    orderUnsettledProxy.set_user_orders(body);
                }
                break;
            case net.EventType.api_user_betfix:
                {
                    // GlobalVar.loading = false;
                    const betProxy: BetProxy = getProxy(BetProxy);
                    betProxy.deleteItem(body.market_id, body.selection_id);
                    const orderUnsettledProxy: OrderUnsettledProxy = getProxy(OrderUnsettledProxy);
                    orderUnsettledProxy.api_user_orders();
                }
                break;
        }
    }
}
