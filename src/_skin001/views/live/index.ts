import getProxy from "@/core/global/getProxy";
import LiveProxy from "./proxy/LiveProxy";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";
import SportUtil from "@/core/global/SportUtil";
import PageRacingDetailProxy from "../page_racing_detail/proxy/PageRacingDetailProxy";

function init(event_id: number, sport_id?: any) {
    const myProxy: LiveProxy = getProxy(LiveProxy);
    const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    const racingDetailProxy: PageRacingDetailProxy = getProxy(PageRacingDetailProxy);
    myProxy.listQueryComp.event_id = event_id.toString();
    myProxy.listQueryComp.sport_id = sport_id ?? homeProxy.listQueryComp.sport_id;
    myProxy.listQueryComp.tag = !SportUtil.isRaceEvent(myProxy.listQueryComp.sport_id)
        ? homeProxy.listQueryComp.tag
        : racingDetailProxy.listQueryComp.tag;
    myProxy.api_event_list();
}

export default { init };
