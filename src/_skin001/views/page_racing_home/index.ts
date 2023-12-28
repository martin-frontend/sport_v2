import Vue from "vue";
import PageRacingHomeProxy from "./proxy/PageRacingHomeProxy";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";
import getProxy from "@/core/global/getProxy";
import NavigationProxy from "../navigation/proxy/NavigationProxy";

function show() {
    if (Vue.router.currentRoute.path != "/page_racing_home") {
        Vue.router.push("/page_racing_home");
    }
}

/**关键字查询 */
function showByKeyword(keyword: string) {
    show();
    const myProxy: PageRacingHomeProxy = getProxy(PageRacingHomeProxy);
    myProxy.listQueryComp.keyword = keyword;
    myProxy.listQueryComp.sport_id = myProxy.sportCheckBoxArr.toString();
    myProxy.api_event_list();
    // myProxy.api_menu_subnav();
}
/**按标签查询 */
function showByTag(tag?: string) {
    show();
    const myProxy: PageRacingHomeProxy = getProxy(PageRacingHomeProxy);
    if (tag) {
        myProxy.listQueryComp.tag = tag;
    }
    myProxy.api_event_list();

    const navProxy: NavigationProxy = getProxy(NavigationProxy);
    navProxy.api_menu_leftnav();
}
/**按sport查询 */
function showBySport(sport_id: any, tag = "today") {
    const myProxy: PageRacingHomeProxy = getProxy(PageRacingHomeProxy);
    myProxy.listQueryComp.sport_id = `${sport_id}`;
    showByTag(tag);
}
export default { show, showBySport, showByTag, showByKeyword };
