import getProxy from "@/core/global/getProxy";
import LiveProxy from "./proxy/LiveProxy";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";
import SportUtil from "@/core/global/SportUtil";
import PageRacingHomeProxy from "../page_racing_home/proxy/PageRacingHomeProxy";

function init(event_id: number, sport_id?: any) {
    const myProxy: LiveProxy = getProxy(LiveProxy);
    const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    const racingHomeProxy: PageRacingHomeProxy = getProxy(PageRacingHomeProxy);
    myProxy.listQueryComp.event_id = event_id.toString();
    myProxy.listQueryComp.sport_id = sport_id ?? homeProxy.listQueryComp.sport_id;
    myProxy.listQueryComp.tag = !SportUtil.isRaceEvent(myProxy.listQueryComp.sport_id)
        ? homeProxy.listQueryComp.tag
        : racingHomeProxy.listQueryComp.tag;
    myProxy.api_event_list();
}

export default { init };
