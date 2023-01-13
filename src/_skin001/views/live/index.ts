import getProxy from "@/core/global/getProxy";
import LiveProxy from "./proxy/LiveProxy";

function show(event_id:number) {
    const myProxy:LiveProxy = getProxy(LiveProxy);
    myProxy.api_event_list(event_id.toString());
}

export default { show };
