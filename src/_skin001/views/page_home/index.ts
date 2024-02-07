import getProxy from "@/core/global/getProxy";
import Vue from "vue";
import PageHomeProxy from "./proxy/PageHomeProxy";
import NavigationProxy from "../navigation/proxy/NavigationProxy";
import SportUtil from "@/core/global/SportUtil";

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
    myProxy.api_event_list();
    if (tag == "love") return;
    const navProxy: NavigationProxy = getProxy(NavigationProxy);
    navProxy.api_menu_leftnav();
}
/**按国家查询 */
function showByCountry(country: string, competitions: string) {
    show();
    const myProxy = getMyProxy();
    myProxy.listQueryComp.competition_id = competitions;
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
    myProxy.pageData.filterCompetition = null;
    myProxy.pageData.selectCompetitionLength = 0;
    myProxy.pageData.allCompetitionLength = 0;
    myProxy.listQueryComp.event_id = "";
    return myProxy;
}

/**按运动查询 */
function showBySport(sport_id: any) {
    const myProxy: PageHomeProxy = getProxy(PageHomeProxy);
    const navProxy: NavigationProxy = getProxy(NavigationProxy);
    if (myProxy.listQueryComp.sport_id != sport_id) {
        myProxy.listQueryComp.sport_id = sport_id;
        myProxy.api_event_market_type_v2();
    }

    const curNav = navProxy.pageData.new_menu_subnav[sport_id];
    const tag = SportUtil.getTag(curNav);
    showByTag(tag);
}
export default { show, showByTag, showByCountry, showByCompetition, showByKeyword, showEventList, showBySport };
