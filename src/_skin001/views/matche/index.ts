import Vue from "vue";
import getProxy from "@/core/global/getProxy";
import MatcheProxy from "./proxy/MatcheProxy";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";

function init(id: number) {
    const myProxy: MatcheProxy = getProxy(MatcheProxy);
    const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    myProxy.listQueryComp.sport_id = homeProxy.listQueryComp.sport_id;
    myProxy.listQueryComp.tag = homeProxy.listQueryComp.tag;
    if (id) {
        myProxy.init(id);
    } else {
        myProxy.pageData.competition_list = [];
    }
}

export default { init };
