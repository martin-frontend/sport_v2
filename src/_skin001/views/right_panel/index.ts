import getProxy from "@/core/global/getProxy";
import RightPanelProxy from "./proxy/RightPanelProxy";

function show(index: number) {
    const myProxy: RightPanelProxy = getProxy(RightPanelProxy);
    myProxy.pageData.liveIndex = index;
    myProxy.isShowLive = true;
}
function showLiveList(isShowLiveList: boolean) {
    const myProxy: RightPanelProxy = getProxy(RightPanelProxy);
    myProxy.pageData.isShowLiveList = isShowLiveList;
    myProxy.isShowLive = true;
}

export default { show, showLiveList };
