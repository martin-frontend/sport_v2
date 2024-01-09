import getProxy from "@/core/global/getProxy";
import LiveListProxy from "./proxy/LiveListProxy";
import LiveProxy from "../live/proxy/LiveProxy";
import Vue from "vue";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";

function show() {
    const myProxy: LiveListProxy = getProxy(LiveListProxy);
    myProxy.pageData.isOpen = true;
    if (Vue.vuetify.framework.breakpoint.mobile) {
        const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
        myProxy.listQueryComp.sport_id = homeProxy.listQueryComp.sport_id;
    } else {
        const liveProxy: LiveProxy = getProxy(LiveProxy);
        myProxy.listQueryComp.sport_id = liveProxy.listQueryComp.sport_id;
    }
    myProxy.api_event_live_list_v2();
}

export default { show };
