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
                    light: {
                        bgBanner: "#ffffff",
                        textGray: "#8E8F91",
                    },
                    dark: {
                        bgBanner: "#272828",
                        textGray: "#8E8F91",
                    },
                },
                dark: false,
            },
        };
        vuetify = new Vuetify(opts);
    }
    return vuetify;
}
