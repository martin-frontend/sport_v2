import Vue from "vue";
import PageRacingHomeProxy from "./proxy/PageRacingHomeProxy";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";
import getProxy from "@/core/global/getProxy";

function show() {
    if (Vue.router.currentRoute.path != "/page_racing_home") {
        Vue.router.push("/page_racing_home");
    }
}

/**按标签查询 */
function showByTag(tag?: string) {
    show();
    const myProxy: PageRacingHomeProxy = getProxy(PageRacingHomeProxy);
    if (tag) {
        myProxy.listQueryComp.tag = tag;
    }
    myProxy.api_event_list();
}
/**按运动查询 */
function showBySport(sport_id: any) {
    const myProxy: PageRacingHomeProxy = getProxy(PageRacingHomeProxy);
    myProxy.listQueryComp.sport_id = sport_id;
    showByTag();
}
export default { show, showBySport, showByTag };
