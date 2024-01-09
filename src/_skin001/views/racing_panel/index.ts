import Vue from "vue";
import RacingPanelProxy from "./proxy/RacingPanelProxy";
import getProxy from "@/core/global/getProxy";

/**按sport查询 */
function init(sport_id: any) {
    const myProxy: RacingPanelProxy = getProxy(RacingPanelProxy);
    myProxy.listQueryComp.sport_id = `${sport_id}`;
    if (myProxy.pageData.tag == 0) {
        myProxy.api_event_list();
    } 
    // else if (myProxy.pageData.tag == 1) {
    //     myProxy.api_event_live_event_v2();
    // }
}

export default { init };
