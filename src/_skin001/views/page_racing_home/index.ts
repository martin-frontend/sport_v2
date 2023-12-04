import Vue from "vue";

function show() {
    if (Vue.router.currentRoute.path != "/page_racing_home") {
        Vue.router.push("/page_racing_home");
    }
}

export default { show };
