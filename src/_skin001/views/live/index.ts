import getProxy from "@/core/global/getProxy";
import LiveProxy from "./proxy/LiveProxy";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";

function init(event_id: number) {
    const myProxy: LiveProxy = getProxy(LiveProxy);
    const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    myProxy.listQueryComp.event_id = event_id.toString();
    myProxy.listQueryComp.sport_id = homeProxy.listQueryComp.sport_id;
    myProxy.api_event_list();
}

export default { init };
