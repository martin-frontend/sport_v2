import getProxy from "@/core/global/getProxy";
import LiveListProxy from "./proxy/LiveListProxy";
import LiveProxy from "../live/proxy/LiveProxy";

function show() {
    const myProxy: LiveListProxy = getProxy(LiveListProxy);
    const liveProxy: LiveProxy = getProxy(LiveProxy);
    myProxy.pageData.isOpen = true;
    myProxy.listQueryComp.sport_id = liveProxy.listQueryComp.sport_id;
    myProxy.api_event_live_list_v2();
}

export default { show };
