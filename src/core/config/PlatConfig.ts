import { MarketTypeVO } from "@/vo/MarketTypeVO";
import { MenuLangVO } from "@/vo/MenuLangVO";
import { PlatConfigVO } from "@/vo/PlatConfigVO";
import { SportsVo } from "@/vo/SportsVo";

export default class PlatConfig extends puremvc.Proxy {
    static NAME = "PlatConfig";
    /**所有的体育种类 */
    static allSprots: SportsVo[] = [];
    /**盘口类型分类 */
    static market_main_type: { id: number; name: string }[] = [];
    /**所有盘口类型 */
    static allMarketType: MarketTypeVO[] = [];
    /**所有语言类型 */
    static allLanguage: MenuLangVO[] = [];
    /**平台配置 */
    static config: PlatConfigVO = {
        client: <any>{
            pcMarketType:
                "MATCH_ODDS,MATCH_ODDS_HALF_TIME,ASIAN_HANDICAP,ASIAN_HANDICAP_HALF_TIME,ASIAN_OVER_UNDER,ASIAN_OVER_UNDER_HALF_TIME",
            h5MarketType: "ASIAN_OVER_UNDER,ASIAN_HANDICAP",
            pcMarketType_extra:
                "ASIAN_HANDICAP_EXTRA_TIME,ASIAN_OVER_UNDER_EXTRA_TIME,ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME,ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME,ASIAN_HANDICAP_AFTER_PENALTIES,ASIAN_OVER_UNDER_AFTER_PENALTIES",
            h5MarketType_extra: "ASIAN_HANDICAP_EXTRA_TIME,ASIAN_OVER_UNDER_EXTRA_TIME",
            champion_type: "RMM_OUTRIGHTS",
            isRecharge: "0",
            MarketType_area: "0",
            OddsColorType: 0,
            isDefaultParlay: 0,
        },
    };
}
