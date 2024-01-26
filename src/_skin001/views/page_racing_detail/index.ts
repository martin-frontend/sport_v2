import Vue from "vue";
import PageRacingDetailProxy from "./proxy/PageRacingDetailProxy";
import getProxy from "@/core/global/getProxy";
import matche from "../matche";
import right_panel from "../right_panel";
import live from "../live";

function show(data: any) {
    if (Vue.router.currentRoute.path != "/page_racing_detail") {
        Vue.router.push("/page_racing_detail");
    }
    const myProxy: PageRacingDetailProxy = getProxy(PageRacingDetailProxy);
    const { listQueryComp, competitionId, matchKey, event_id } = data;
    myProxy.pageData.competitionId = competitionId;
    myProxy.pageData.matchKey = matchKey;
    Object.assign(myProxy.listQueryComp, {
        ...listQueryComp,
        unique: PageRacingDetailProxy.NAME,
    });

    if (event_id) {
        myProxy.listQueryStates.event_id = event_id.toString();
        myProxy.api_event_race_detail(event_id);
        right_panel.show(1);
        right_panel.showLiveList(false);
        // matche.init(event_id);
        live.init(event_id, listQueryComp.sport_id);
    }
    myProxy.api_event_list();
}

export default { show };
