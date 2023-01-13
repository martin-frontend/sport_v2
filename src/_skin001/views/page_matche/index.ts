import Vue from "vue";
import getProxy from "@/core/global/getProxy";
import PageMatcheProxy from "./proxy/PageMatcheProxy";

function show() {
    Vue.router.push("/page_matche")
}

function init(id: number) {
    const myProxy: PageMatcheProxy = getProxy(PageMatcheProxy);
    myProxy.init(id);
}

export default { show, init };
