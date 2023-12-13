import Vue from "vue";
import PageRacingDetailProxy from "./proxy/PageRacingDetailProxy";
import getProxy from "@/core/global/getProxy";

function show(data: any) {
    if (Vue.router.currentRoute.path != "/page_racing_detail") {
        Vue.router.push("/page_racing_detail");
    }
    const myProxy: PageRacingDetailProxy = getProxy(PageRacingDetailProxy);
    const { listQueryComp, competitionId, matchKey } = data;
    myProxy.pageData.competitionId = competitionId;
    myProxy.pageData.matchKey = matchKey;
    myProxy.listQueryComp = {
        ...listQueryComp,
        unique: PageRacingDetailProxy.NAME,
    };
    myProxy.api_event_list();
}

export default { show };
