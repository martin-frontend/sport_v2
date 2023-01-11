import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

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
];

const router = new VueRouter({ routes });
router.beforeEach((to: any, from: any, next: any) => {
    if (to.path == "/") {
        next("/page_home");
    } else {
        next();
    }
});
export default router;
