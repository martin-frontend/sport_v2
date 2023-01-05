import Vue from "vue";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";

let vuetify: Vuetify;

export function getVuetify(): Vuetify {
    if (!vuetify) {
        Vue.use(Vuetify);
        const opts = {
            theme: {
                themes: {
                    light: {},
                    dark: {},
                },
                dark: false,
            },
        };
        vuetify = new Vuetify(opts);
    }
    return vuetify;
}
