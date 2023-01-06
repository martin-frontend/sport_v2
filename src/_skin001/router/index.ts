import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "page_home",
        component: () => import(/* webpackChunkName: "skin001_page_home" */ "@/_skin001/views/page_home/views/PageHome.vue"),
    },
    {
        path: "/",
        name: "page_matche",
        component: () => import(/* webpackChunkName: "skin001_page_matche" */ "@/_skin001/views/page_matche/views/PageMatche.vue"),
    },
];

const router = new VueRouter({ routes });

export default router;
