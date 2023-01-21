import getProxy from "@/core/global/getProxy";
import Vue from "vue";
import PageOrderProxy from "./proxy/PageOrderProxy";

function show() {
    Vue.router.push("/page_order");

    const myProxy: PageOrderProxy = getProxy(PageOrderProxy);
    myProxy.pageData.list = [];
    myProxy.api_user_orders();
}

export default { show };
