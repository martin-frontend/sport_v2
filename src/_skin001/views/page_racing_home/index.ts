import Vue from "vue";
import PageRacingHomeProxy from "./proxy/PageRacingHomeProxy";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";
import getProxy from "@/core/global/getProxy";

function show() {
    if (Vue.router.currentRoute.path != "/page_racing_home") {
        Vue.router.push("/page_racing_home");
    }
}

/**按运动查询 */
function showBySport(sport_id: any) {
    // const myProxy: PageRacingHomeProxy = getProxy(PageRacingHomeProxy);
    // myProxy.listQueryComp.sport_id = sport_id;
    // myProxy.listQueryComp.tag = tag;
    const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    homeProxy.listQueryComp.sport_id = sport_id;
    show();
}
export default { show, showBySport };
