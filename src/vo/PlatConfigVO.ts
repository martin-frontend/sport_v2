export interface PlatConfigVO {
    client: {
        cdn_url: string;
        plat_id: string;
        isRecharge: string;
        pcMarketType: string;
        h5MarketType: string;
        pcMarketType_extra: string; //延时时显示的盘口
        h5MarketType_extra: string; //延时时显示的盘口
        MarketType_area: string;
        champion_type: string;
        /**赔率变化字体颜色类型
         * 0：赔率上升为红色，下降为绿色
         * 1:  赔率上升为绿色，下降为红色
         */
        OddsColorType: number;
        isDefaultParlay: number;
    };
}
