import Vue from "vue";
import getProxy from "@/core/global/getProxy";
import MatcheProxy from "./proxy/MatcheProxy";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";

function init(id: number, sport_id?: any, tag?: any) {
    const myProxy: MatcheProxy = getProxy(MatcheProxy);
    const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    if (myProxy.listQueryComp.sport_id != homeProxy.listQueryComp.sport_id && homeProxy.listQueryComp.sport_id != -1) {
        myProxy.listQueryComp.sport_id = homeProxy.listQueryComp.sport_id;
    }
    if (sport_id) {
        myProxy.listQueryComp.sport_id = sport_id;
    }
    myProxy.listQueryComp.tag = tag ?? homeProxy.listQueryComp.tag;
    if (id) {
        myProxy.init(id);
    } else {
        myProxy.pageData.competition_list = [];
    }
}

export default { init };
