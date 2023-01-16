import Vue from "vue";
import getProxy from "@/core/global/getProxy";
import MatcheProxy from "./proxy/MatcheProxy";

function show() {
    Vue.router.push("/page_matche")
}

function init(id: number) {
    const myProxy: MatcheProxy = getProxy(MatcheProxy);
    myProxy.init(id);
}

export default { show, init };