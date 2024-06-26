import "@/_skin001/assets/fonts/fonts.css";
import Vue from "vue";
import App from "@/_skin001/App.vue";
import router from "@/_skin001/router";
import "@/_skin001/icons"; // svg 图标
import "@/style/fontsize.scss";
import "@/_skin001/style/space.scss";
import "@/_skin001/style/rounded.scss";
import "@/_skin001/style/common.scss";
import { getVuetify } from "@/_skin001/plugins/vuetify";
import Notifications from "vue-notification";
import velocity from "velocity-animate";
import VueLoadmore from "vuejs-loadmore";
import LogUtil from "@/core/global/LogUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { EnumDeviceType } from "@/core/enum/EnumDeviceType";
import AppFacade from "@/_skin001/AppFacade";
import { getUrlHashParam, isAndroid, isIOS } from "@/core/global/Functions";
import { js_utils } from "custer-js-utils";
import BtnYellow from "@/_skin001/views/widget/btn_yellow/BtnYellow.vue";
import BtnInfo from "@/_skin001/views/widget/btn_info/BtnInfo.vue";
import Overlay from "@/_skin001/views/widget/overlay/Overlay.vue";
import LoadMore from "@/_skin001/views/widget/loadMore/LoadMore.vue";
import Loader from "@/_skin001/views/widget/loader/Loader.vue";
import HorizontalScroll from "@/_skin001/views/widget/horizontal_scroll/HorizontalScroll.vue";
import MatcheItem from "@/_skin001_1/views/page_home/widget/matche_item/MatcheItem.vue";
import MatcheItemMobile from "@/_skin001_1/views/page_home/widget/matche_item_mobile/MatcheItemMobile.vue";
import SkinVariable from "@/core/SkinVariable";
import SmallDecimal from "@/_skin001/views/widget/small_decimal/SmallDecimal.vue";

SkinVariable.home_market_type = 2;
SkinVariable.skin="skin001_1";
LogUtil.init();
Vue.config.productionTip = false;
Vue.use(VueLoadmore);
Vue.use(Notifications, { velocity });

// 注册到全局
Vue.component("MatcheItem", MatcheItem);
Vue.component("MatcheItemMobile", MatcheItemMobile);

Vue.component("btn-yellow", BtnYellow);
Vue.component("btn-info", BtnInfo);
Vue.component("overlay", Overlay);
Vue.component("load_more", LoadMore);
Vue.component("loader", Loader);
Vue.component("horizontal_scroll", HorizontalScroll);
Vue.component("SmallDecimal", SmallDecimal);

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
GlobalVar.pre_event_id = parseInt(getUrlHashParam("id"));
GlobalVar.timezone_change = js_utils.getQueryVariable("timezone_change") ?? "0";

const vuetify = getVuetify();
Vue["vuetify"] = vuetify;
Vue["router"] = router;
//@ts-ignore
window["vm"] = new Vue({
    router,
    vuetify,
    render: (h) => h(App),
});

AppFacade.getInstance().startup();
