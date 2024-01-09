import Vue from "vue";
import live_list from "../live_list";

function show() {
    Vue.router.push("/page_live_list");
    live_list.show();
}

export default { show };
