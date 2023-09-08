import "@/_skin001/assets/fonts/fonts.css";
import Vue from "vue";
import App from "./views/HistoryResult.vue";
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
import "element-ui/lib/theme-chalk/index.css";
import { DatePicker } from "element-ui";
LogUtil.init();
Vue.config.productionTip = false;
Vue.use(VueLoadmore);
Vue.use(Notifications, { velocity });
Vue.use(DatePicker);
// 注册到全局
Vue.component("btn-yellow", BtnYellow);
Vue.component("btn-info", BtnInfo);
AppFacade.getInstance().startup();

const vuetify = getVuetify();

const daynight_type = getQueryVariable("daynight_type");
vuetify.framework.theme.dark = daynight_type == "2";

GlobalVar.MarketType_area = getQueryVariable("MarketType_area") || "0";
GlobalVar.pageType = "skin001_history";
Vue["vuetify"] = vuetify;
Vue.config.productionTip = false;
//@ts-ignore
window["vm"] = new Vue({
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
