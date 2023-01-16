import getProxy from "@/core/global/getProxy";
import LiveProxy from "./proxy/LiveProxy";

function init(event_id:number) {
    const myProxy:LiveProxy = getProxy(LiveProxy);
    myProxy.api_event_list(event_id.toString());
}

export default { init };
