import getProxy from "@/core/global/getProxy";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import live from "../views/live";
import matche from "../views/matche";
import PageHomeProxy from "../views/page_home/proxy/PageHomeProxy";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/page_home",
        name: "page_home",
        component: () => import(/* webpackChunkName: "skin001_page_home" */ "@/_skin001/views/page_home/views/PageHome.vue"),
    },
    {
        path: "/page_matche",
        name: "page_matche",
        component: () => import(/* webpackChunkName: "skin001_page_matche" */ "@/_skin001/views/page_matche/views/PageMatche.vue"),
    },
    {
        path: "/page_live_list",
        name: "page_live_list",
        component: () => import(/* webpackChunkName: "skin001_page_live_list" */ "@/_skin001/views/page_live_list/views/PageLiveList.vue"),
    },
    {
        path: "/page_order",
        name: "page_order",
        component: () => import(/* webpackChunkName: "skin001_page_order" */ "@/_skin001/views/page_order/views/PageOrder.vue"),
    },
];

const router = new VueRouter({ routes });
router.beforeEach((to: any, from: any, next: any) => {
    switch (from.path) {
        case "/page_home":
            const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
            const routerBox = document.getElementById("routerBox");
            if (routerBox) homeProxy.pageData.scrollOffset = routerBox.scrollTop;
            break;
    }
    if (to.path == "/") {
        next("/page_home");
    } else if (to.path == "/page_matche" && document.body.clientWidth > 960) {
        next("/page_home");
        const { id } = Vue.router.currentRoute.query;
        if (id) {
            matche.init(id);
            live.init(id);
        }
    } else {
        next();
    }
});
export default router;
