import AbstractMediator from "@/core/abstract/AbstractMediator";
import LangConfig from "@/_skin001_history_result/core/config/LangConfig";
import PlatConfig from "@/core/config/PlatConfig";
import GlobalVar from "@/core/global/GlobalVar";
import NotificationName from "@/core/NotificationName";
import net from "@/net/setting";

export default class NetObserver extends AbstractMediator {
    static NAME = "NetObserver_historyResult";

    listNotificationInterests(): string[] {
        return [
            net.EventType.api_config,
            NotificationName.LANG_CONFIG,
            net.EventType.api_user_info,
            net.EventType.api_event_sports,
            net.EventType.api_event_market_type_v2,
        ];
    }

    public handleNotification(notification: puremvc.INotification): void {
        const body = notification.getBody();
        const type = notification.getType();
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
                GlobalVar.MarketType_area = PlatConfig.config.client.MarketType_area;

                LangConfig.load(GlobalVar.lang);

                break;
            case NotificationName.LANG_CONFIG:
                {
                    // //@ts-ignore
                    // window["vm"].$mount("#app");

                    if (GlobalVar.token) {
                        GlobalVar.loading = true;
                        this.facade.sendNotification(net.HttpType.api_user_info);
                        this.facade.sendNotification(net.HttpType.api_event_sports);
                        this.facade.sendNotification(net.HttpType.api_event_market_type_v2);
                        this.facade.sendNotification(net.HttpType.api_user_orders, {
                            is_settle: 0,
                            unique: "settleCount",
                        });
                    }
                }
                break;

            case net.EventType.api_event_sports:
                PlatConfig.allSprots = body;
                break;
            case net.EventType.api_event_market_type_v2:
                PlatConfig.allMarketType = body.market_type;
                PlatConfig.market_main_type = body.market_main_type;
                break;
        }
    }
}
