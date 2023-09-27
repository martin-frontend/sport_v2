import cmd_api_menu_subnav from "./cmd_api_menu_subnav";
import cmd_api_menu_nav from "./cmd_api_menu_nav";
import cmd_api_event_index from "./cmd_api_event_index";
import cmd_api_user_placebet from "./cmd_api_user_placebet";
import cmd_api_user_info from "./cmd_api_user_info";
import cmd_api_user_orders from "./cmd_api_user_orders";
import cmd_api_user_lovematch from "./cmd_api_user_lovematch";
import cmd_api_user_love from "./cmd_api_user_love";
import cmd_api_event_single from "./cmd_api_event_single";
import cmd_api_marquee_index from "./cmd_api_marquee_index";
import cmd_api_event_hot from "./cmd_api_event_hot";
import cmd_api_user_set_user_setting from "./cmd_api_user_set_user_setting";
import cmd_api_event_sports from "./cmd_api_event_sports";
import cmd_api_event_market_type from "./cmd_api_event_market_type";
import cmd_api_menu_lang from "./cmd_api_menu_lang";
import cmd_api_event_live_list from "./cmd_api_event_live_list";
import cmd_api_event_live_url from "./cmd_api_event_live_url";
import cmd_api_menu_subnav_country from "./cmd_api_menu_subnav_country";
import cmd_api_event_list from "./cmd_api_event_list";
import cmd_api_market_list from "./cmd_api_market_list";
import cmd_api_event_states from "./cmd_api_event_states";
import cmd_api_user_betfix from "./cmd_api_user_betfix";
import cmd_api_user_prebet from "./cmd_api_user_prebet";
import cmd_api_user_pending from "./cmd_api_user_pending";
import cmd_api_market_typelist from "./cmd_api_market_typelist";
import cmd_api_config from "./cmd_api_config";
import cmd_public_plat_config from "./cmd_public_plat_config";
import cmd_api_event_result from "./cmd_api_event_result";
import cmd_api_event_market_type_v2 from "./cmd_api_event_market_type_v2";
import cmd_public_order_detail_data from "./cmd_public_order_detail_data";
import cmd_api_helpcenter_list from "./cmd_api_helpcenter_list";
import cmd_api_user_prebet_v3 from "./cmd_api_user_prebet_v3";
import cmd_api_user_betfix_v3 from "./cmd_api_user_betfix_v3";
import cmd_api_user_orders_v3 from "./cmd_api_user_orders_v3";
/**
 * document: http://18.167.151.206:8090/pages/viewpage.action?pageId=11076347
 */
/**协议*/
const HttpType = {
    /**左边菜单*/
    api_menu_subnav: "api/menu/subnav",
    /**顶部菜单*/
    api_menu_nav: "api/menu/nav",
    /**赛事接口*/
    api_event_index: "api/event/index",
    /**投注接口*/
    api_user_placebet: "api/user/placebet",
    /**取得用户基本讯息*/
    api_user_info: "api/user/info",
    /**投注纪录*/
    api_user_orders: "api/user/orders",
    /**最爱赛事列表*/
    api_user_lovematch: "api/user/lovematch",
    /**添加/删除最爱赛事*/
    api_user_love: "api/user/love",
    /**单项赛事*/
    api_event_single: "api/event/single",
    /**跑马灯*/
    api_marquee_index: "api/marquee/index",
    /**热门赛事*/
    api_event_hot: "api/event/hot",
    /**前台客製化選項-设定接口*/
    api_user_set_user_setting: "api/user/set_user_setting",
    /**前台客製化選項-获取所有有效体育资讯接口*/
    api_event_sports: "api/event/sports",
    /**前台客製化選項-获取所有有效体育盘口资讯接口(弃用)*/
    api_event_market_type: "api/event/market_type",
    /**前台客製化選項-获取所有语言*/
    api_menu_lang: "api/menu/lang",
    /**直播清单接口*/
    api_event_live_list: "api/event/live_list",
    /**取得直播连结*/
    api_event_live_url: "api/event/live_url",
    /**二级菜单*/
    api_menu_subnav_country: "api/menu/subnav_country",
    /**赛事接口-新*/
    api_event_list: "api/event/list",
    /**盘口接口-新*/
    api_market_list: "api/market/list",
    /**赛事进程*/
    api_event_states: "api/event/states",
    /**投注接口(固赔)*/
    api_user_betfix: "api/user/betfix",
    /**预投注接口(固赔)*/
    api_user_prebet: "api/user/prebet",
    /**待确认提示结果*/
    api_user_pending: "api/user/pending",
    /**盘口接口(多个盘口玩法信息)*/
    api_market_typelist: "api/market/typelist",
    /**平台配置相關接口*/
    api_config: "api/config",
    /**平台配置相關接口(外部调用)*/
    public_plat_config: "public/plat_config",
    /**赛事结果接口*/
    api_event_result: "api/event/result",
    /**盘口分类v2*/
    api_event_market_type_v2: "api/event/market_type_v2",
    /**三方获取注单详情*/
    public_order_detail_data: "public/order_detail_data",
    /**帮助中心內容接口*/
    api_helpcenter_list: "api/helpcenter/list",
    /**预下注V3*/
    api_user_prebet_v3: "api/user/prebet_v3",
    /**下注 V3*/
    api_user_betfix_v3: "api/user/betfix_v3",
    /**投注纪录v3*/
    api_user_orders_v3: "api/user/orders_v3",
};
/**事件*/
const EventType = {
    /**--请求开始*/
    REQUEST_START: "REQUEST_START",
    /**--请求结束 */
    REQUEST_END: "REQUEST_END",
    /**请求错误 */
    REQUEST_ERROR: "REQUEST_ERROR",
    /**IO错误 */
    IO_ERROR: "IO_ERROR",
    /**左边菜单*/
    api_menu_subnav: "api_menu_subnav",
    /**顶部菜单*/
    api_menu_nav: "api_menu_nav",
    /**赛事接口*/
    api_event_index: "api_event_index",
    /**投注接口*/
    api_user_placebet: "api_user_placebet",
    /**取得用户基本讯息*/
    api_user_info: "api_user_info",
    /**投注纪录*/
    api_user_orders: "api_user_orders",
    /**最爱赛事列表*/
    api_user_lovematch: "api_user_lovematch",
    /**添加/删除最爱赛事*/
    api_user_love: "api_user_love",
    /**单项赛事*/
    api_event_single: "api_event_single",
    /**跑马灯*/
    api_marquee_index: "api_marquee_index",
    /**热门赛事*/
    api_event_hot: "api_event_hot",
    /**前台客製化選項-设定接口*/
    api_user_set_user_setting: "api_user_set_user_setting",
    /**前台客製化選項-获取所有有效体育资讯接口*/
    api_event_sports: "api_event_sports",
    /**前台客製化選項-获取所有有效体育盘口资讯接口(弃用)*/
    api_event_market_type: "api_event_market_type",
    /**前台客製化選項-获取所有语言*/
    api_menu_lang: "api_menu_lang",
    /**直播清单接口*/
    api_event_live_list: "api_event_live_list",
    /**取得直播连结*/
    api_event_live_url: "api_event_live_url",
    /**二级菜单*/
    api_menu_subnav_country: "api_menu_subnav_country",
    /**赛事接口-新*/
    api_event_list: "api_event_list",
    /**盘口接口-新*/
    api_market_list: "api_market_list",
    /**赛事进程*/
    api_event_states: "api_event_states",
    /**投注接口(固赔)*/
    api_user_betfix: "api_user_betfix",
    /**预投注接口(固赔)*/
    api_user_prebet: "api_user_prebet",
    /**待确认提示结果*/
    api_user_pending: "api_user_pending",
    /**盘口接口(多个盘口玩法信息)*/
    api_market_typelist: "api_market_typelist",
    /**平台配置相關接口*/
    api_config: "api_config",
    /**平台配置相關接口(外部调用)*/
    public_plat_config: "public_plat_config",
    /**赛事结果接口*/
    api_event_result: "api_event_result",
    /**盘口分类v2*/
    api_event_market_type_v2: "api_event_market_type_v2",
    /**三方获取注单详情*/
    public_order_detail_data: "public_order_detail_data",
    /**帮助中心內容接口*/
    api_helpcenter_list: "api_helpcenter_list",
    /**预下注V3*/
    api_user_prebet_v3: "api_user_prebet_v3",
    /**下注 V3*/
    api_user_betfix_v3: "api_user_betfix_v3",
    /**投注纪录v3*/
    api_user_orders_v3: "api_user_orders_v3",
};
/**注册协议*/
function initCommand() {
    const facade = puremvc.Facade.getInstance();
    facade.registerCommand(HttpType.api_menu_subnav, cmd_api_menu_subnav);
    facade.registerCommand(HttpType.api_menu_nav, cmd_api_menu_nav);
    facade.registerCommand(HttpType.api_event_index, cmd_api_event_index);
    facade.registerCommand(HttpType.api_user_placebet, cmd_api_user_placebet);
    facade.registerCommand(HttpType.api_user_info, cmd_api_user_info);
    facade.registerCommand(HttpType.api_user_orders, cmd_api_user_orders);
    facade.registerCommand(HttpType.api_user_lovematch, cmd_api_user_lovematch);
    facade.registerCommand(HttpType.api_user_love, cmd_api_user_love);
    facade.registerCommand(HttpType.api_event_single, cmd_api_event_single);
    facade.registerCommand(HttpType.api_marquee_index, cmd_api_marquee_index);
    facade.registerCommand(HttpType.api_event_hot, cmd_api_event_hot);
    facade.registerCommand(HttpType.api_user_set_user_setting, cmd_api_user_set_user_setting);
    facade.registerCommand(HttpType.api_event_sports, cmd_api_event_sports);
    facade.registerCommand(HttpType.api_event_market_type, cmd_api_event_market_type);
    facade.registerCommand(HttpType.api_menu_lang, cmd_api_menu_lang);
    facade.registerCommand(HttpType.api_event_live_list, cmd_api_event_live_list);
    facade.registerCommand(HttpType.api_event_live_url, cmd_api_event_live_url);
    facade.registerCommand(HttpType.api_menu_subnav_country, cmd_api_menu_subnav_country);
    facade.registerCommand(HttpType.api_event_list, cmd_api_event_list);
    facade.registerCommand(HttpType.api_market_list, cmd_api_market_list);
    facade.registerCommand(HttpType.api_event_states, cmd_api_event_states);
    facade.registerCommand(HttpType.api_user_betfix, cmd_api_user_betfix);
    facade.registerCommand(HttpType.api_user_prebet, cmd_api_user_prebet);
    facade.registerCommand(HttpType.api_user_pending, cmd_api_user_pending);
    facade.registerCommand(HttpType.api_market_typelist, cmd_api_market_typelist);
    facade.registerCommand(HttpType.api_config, cmd_api_config);
    facade.registerCommand(HttpType.public_plat_config, cmd_public_plat_config);
    facade.registerCommand(HttpType.api_event_result, cmd_api_event_result);
    facade.registerCommand(HttpType.api_event_market_type_v2, cmd_api_event_market_type_v2);
    facade.registerCommand(HttpType.public_order_detail_data, cmd_public_order_detail_data);
    facade.registerCommand(HttpType.api_helpcenter_list, cmd_api_helpcenter_list);
    facade.registerCommand(HttpType.api_user_prebet_v3, cmd_api_user_prebet_v3);
    facade.registerCommand(HttpType.api_user_betfix_v3, cmd_api_user_betfix_v3);
    facade.registerCommand(HttpType.api_user_orders_v3, cmd_api_user_orders_v3);
}
const net = { HttpType, EventType, initCommand };
export default net;
