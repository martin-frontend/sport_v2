import getProxy from "@/core/global/getProxy";
import Vue from "vue";
import PageHomeProxy from "./proxy/PageHomeProxy";

function show() {
    if (Vue.router.currentRoute.path != "/page_home") {
        Vue.router.replace("/page_home");
    }
}

/**按标签查询 */
function showByTag(tag: string) {
    show();
    const myProxy = getMyProxy();
    myProxy.listQueryComp.tag = tag;
    if (tag == "love") {
        myProxy.api_user_lovematch();
    } else {
        myProxy.api_event_list();
    }
    myProxy.api_menu_subnav();
}
/**按国家查询 */
function showByCountry(country: string) {
    show();
    const myProxy = getMyProxy();
    myProxy.listQueryComp.country = country;
    myProxy.api_event_list();
    // myProxy.api_menu_subnav();
}
/**按联赛查询 */
function showByCompetition(competition_id: number) {
    show();
    const myProxy = getMyProxy();
    myProxy.listQueryComp.competition_id = competition_id.toString();
    myProxy.api_event_list();
    // myProxy.api_menu_subnav();
}
/**关键字查询 */
function showByKeyword(keyword: string) {
    show();
    const myProxy = getMyProxy();
    myProxy.listQueryComp.keyword = keyword;
    myProxy.api_event_list();
    myProxy.api_menu_subnav();
}
/**刷新一次列表 */
function showEventList() {
    const myProxy: PageHomeProxy = getProxy(PageHomeProxy);
    myProxy.api_event_list();
    myProxy.api_menu_subnav();
}

function getMyProxy(): PageHomeProxy {
    const myProxy: PageHomeProxy = getProxy(PageHomeProxy);
    myProxy.listQueryComp.country = "";
    myProxy.listQueryComp.keyword = "";
    myProxy.listQueryComp.competition_id = "";
    myProxy.listQueryComp.tag = "";
    return myProxy;
}

export default { show, showByTag, showByCountry, showByCompetition, showByKeyword, showEventList };
