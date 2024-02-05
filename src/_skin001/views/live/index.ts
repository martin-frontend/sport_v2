import getProxy from "@/core/global/getProxy";
import LiveProxy from "./proxy/LiveProxy";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";
import SportUtil from "@/core/global/SportUtil";
import PageRacingDetailProxy from "../page_racing_detail/proxy/PageRacingDetailProxy";

function init(event_id: number, sport_id?: any, tag?: any) {
    const myProxy: LiveProxy = getProxy(LiveProxy);
    const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    const racingDetailProxy: PageRacingDetailProxy = getProxy(PageRacingDetailProxy);
    myProxy.listQueryComp.sport_id = sport_id ?? homeProxy.listQueryComp.sport_id;
    myProxy.listQueryComp.tag = !SportUtil.isRaceEvent(myProxy.listQueryComp.sport_id)
        ? homeProxy.listQueryComp.tag
        : tag ?? racingDetailProxy.listQueryComp.tag;

    if (event_id) {
        myProxy.listQueryComp.event_id = event_id.toString();
        myProxy.api_event_list();
    } else {
        myProxy.pageData.competition_list = [];
    }
}

export default { init };
