import "@/_skin001/assets/fonts/fonts.css";
import Vue from "vue";
import App from "./views/Help.vue";
import "@/_skin001/icons"; // svg 图标
import "@/style/fontsize.scss";
import "@/_skin001/style/common.scss";
import { getVuetify } from "@/_skin001/plugins/vuetify";
import Notifications from "vue-notification";
import velocity from "velocity-animate";
import VueLoadmore from "vuejs-loadmore";
import LogUtil from "@/core/global/LogUtil";
import GlobalVar from "@/core/global/GlobalVar";
import BtnYellow from "@/_skin001/views/widget/btn_yellow/BtnYellow.vue";
import BtnInfo from "@/_skin001/views/widget/btn_info/BtnInfo.vue";
import AppFacade from "./AppFacade";
import { getQueryVariable } from "@/core/global/Functions";
LogUtil.init();
Vue.config.productionTip = false;
Vue.use(VueLoadmore);
Vue.use(Notifications, { velocity });

// 注册到全局
Vue.component("btn-yellow", BtnYellow);
Vue.component("btn-info", BtnInfo);
AppFacade.getInstance().startup();

const vuetify = getVuetify();

const dark = getQueryVariable("dark");
vuetify.framework.theme.dark = dark == "true";

Vue["vuetify"] = vuetify;
Vue.config.productionTip = false;
new Vue({
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
