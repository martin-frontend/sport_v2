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
    static config: PlatConfigVO;
}
