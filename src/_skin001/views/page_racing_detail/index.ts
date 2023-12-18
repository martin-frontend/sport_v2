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
    myProxy.listQueryComp = {
        ...listQueryComp,
        unique: PageRacingDetailProxy.NAME,
    };
    if(event_id) {
        right_panel.show(1);
        // matche.init(event_id);
        live.init(event_id);
    }
    myProxy.api_event_list();
}

export default { show };
