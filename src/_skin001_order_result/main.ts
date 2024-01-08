import Vue from "vue";
import App from "./views/OrderResult.vue";
import "@/style/fontsize.scss";
import "./style/common.scss";
import { getVuetify } from "./plugins/vuetify";
import "@/_skin001/icons"; // svg 图标

Vue.config.productionTip = false;

const vuetify = getVuetify();
Vue["vuetify"] = vuetify;

//@ts-ignore
window["vm"] = new Vue({
    vuetify,
    render: (h) => h(App),
}).$mount("#app");
