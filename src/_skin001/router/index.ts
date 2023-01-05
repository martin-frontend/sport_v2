import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "page_home",
        component: () => import(/* webpackChunkName: "skin001_page_home" */ "@/_skin001/views/page_home/views/PageHome.vue"),
        meta: {
            title: "page_home",
            bShow: false,
        },
    },
];

const router = new VueRouter({ routes });

export default router;
