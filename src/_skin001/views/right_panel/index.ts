import getProxy from "@/core/global/getProxy";
import RightPanelProxy from "./proxy/RightPanelProxy";

function show(index:number) {
    const myProxy: RightPanelProxy = getProxy(RightPanelProxy);
    myProxy.pageData.liveIndex = index;
}

export default { show };
