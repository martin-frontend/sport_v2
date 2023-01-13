import "@/_skin001/assets/fonts/fonts.css";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "@/_skin001/icons"; // svg 图标
import "@/style/fontsize.scss";
import "./style/common.scss";
import { getVuetify } from "./plugins/vuetify";
import Notifications from "vue-notification";
import velocity from "velocity-animate";
import VueLoadmore from "vuejs-loadmore";
import LogUtil from "@/core/global/LogUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { EnumDeviceType } from "@/core/enum/EnumDeviceType";
import AppFacade from "./AppFacade";
import { isAndroid, isIOS } from "@/core/global/Functions";
import { js_utils } from "custer-js-utils";
import BtnYellow from "./views/widget/btn_yellow/BtnYellow.vue";
import BtnInfo from "./views/widget/btn_info/BtnInfo.vue";
import Overlay from "./views/widget/overlay/Overlay.vue";

LogUtil.init();
Vue.config.productionTip = false;
Vue.use(VueLoadmore);
Vue.use(Notifications, { velocity });

// 注册到全局
Vue.component("btn-yellow", BtnYellow);
Vue.component("btn-info", BtnInfo);
Vue.component("overlay", Overlay);

if (isAndroid()) {
    GlobalVar.device_type = EnumDeviceType.ANDROID;
} else if (isIOS()) {
    GlobalVar.device_type = EnumDeviceType.IOS;
} else {
    GlobalVar.device_type = EnumDeviceType.OTHER;
}

GlobalVar.host = process.env.VUE_APP_BASE_API;
GlobalVar.token = js_utils.getQueryVariable("t") ?? "";
GlobalVar.lang = js_utils.getQueryVariable("lang") ?? "zh_CN";
GlobalVar.displayname = js_utils.getQueryVariable("displayname") ?? "";
AppFacade.getInstance().startup();

const vuetify = getVuetify();
Vue["vuetify"] = vuetify;
Vue["router"] = router;
//@ts-ignore
window["vm"] = new Vue({
    router,
    vuetify,
    render: (h) => h(App),
});
