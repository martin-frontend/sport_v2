import Vue from "vue";
import PageRacingDetailProxy from "./proxy/PageRacingDetailProxy";
import getProxy from "@/core/global/getProxy";

function show(data: any) {
    if (Vue.router.currentRoute.path != "/page_racing_detail") {
        Vue.router.push("/page_racing_detail");
    }
    const myProxy: PageRacingDetailProxy = getProxy(PageRacingDetailProxy);
    const { pageData, listQueryMarket, listQueryStates, listQueryComp, competition_id, matchKey } = data;
    Object.assign(myProxy.pageData, pageData);
    myProxy.pageData.curCompetitionId = competition_id;
    myProxy.pageData.curMatchKey = matchKey;
    myProxy.listQueryMarket = listQueryMarket;
    myProxy.listQueryStates = listQueryStates;
    myProxy.listQueryComp = listQueryComp;
}

export default { show };
