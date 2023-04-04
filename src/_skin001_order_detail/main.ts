import Vue from "vue";
import App from "./views/PageOrderDetail.vue";
import "@/style/fontsize.scss";

Vue.config.productionTip = false;
new Vue({
    render: (h) => h(App),
}).$mount("#app");
