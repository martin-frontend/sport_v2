import Vue from "vue";
import getProxy from "@/core/global/getProxy";
import MatcheProxy from "./proxy/MatcheProxy";
import PageHomeProxy from "../page_home/proxy/PageHomeProxy";

function init(id: number) {
    const myProxy: MatcheProxy = getProxy(MatcheProxy);
    const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    myProxy.init(id, homeProxy.listQueryComp.sport_id);
}

export default { init };
