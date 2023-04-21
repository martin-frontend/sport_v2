import getProxy from "@/core/global/getProxy";
import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import PageHomeProxy from "../views/page_home/proxy/PageHomeProxy";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/page_home",
        name: "page_home",
        component: () =>
            import(
                /* webpackChunkName: "skin001_page_home" */ "@/_skin001/views/page_home/views/PageHome.vue"
            ),
    },
    {
        path: "/page_matche",
        name: "page_matche",
        component: () =>
            import(
                /* webpackChunkName: "skin001_page_matche" */ "@/_skin001/views/page_matche/views/PageMatche.vue"
            ),
    },
    {
        path: "/page_live_list",
        name: "page_live_list",
        component: () =>
            import(
                /* webpackChunkName: "skin001_page_live_list" */ "@/_skin001/views/page_live_list/views/PageLiveList.vue"
            ),
    },
    {
        path: "/page_order",
        name: "page_order",
        component: () =>
            import(
                /* webpackChunkName: "skin001_page_order" */ "@/_skin001/views/page_order/views/PageOrder.vue"
            ),
    },
    {
        path: "/page_help",
        name: "page_help",
        component: () =>
            import(
                /* webpackChunkName: "skin001_page_help" */ "@/_skin001_help/views/Help.vue"
            ),
    },
    {
        path: "/competion_result",
        name: "competion_result",
        component: () =>
            import(
                /* webpackChunkName: "skin001_page_competion_result" */ "@/_skin001_competion_result/views/CompetionResult.vue"
            ),
    },
];

const router = new VueRouter({ routes });
router.beforeEach((to: any, from: any, next: any) => {
    switch (from.path) {
        case "/page_home":
            const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
            const routerBox = document.getElementById("routerBox");
            if (routerBox)
                homeProxy.pageData.scrollOffset = routerBox.scrollTop;
            break;
    }
    if (to.path == "/") {
        next("/page_home");
    } else if (to.path == "/page_matche" && document.body.clientWidth > 960) {
        next("/page_home");
    } else {
        next();
    }
});

export default router;
