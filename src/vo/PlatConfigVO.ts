export interface PlatConfigVO {
    client: {
        cdn_url: string;
        plat_id: string;
        isRecharge: string;
        pcMarketType: string;
        h5MarketType: string;
        pcMarketType_extra: string;//延时时显示的盘口
        h5MarketType_extra: string;//延时时显示的盘口
        MarketType_area: string;
        champion_type: string;
    };
}
