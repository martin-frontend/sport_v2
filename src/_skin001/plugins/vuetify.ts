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
                        btnPlain: "#0F1213",
                    },
                    dark: {
                        bgBanner: "#272828",
                        textGray: "#8E8F91",
                        btnPlain: "#FFFFFF",
                    },
                },
                dark: false,
            },
        };
        vuetify = new Vuetify(opts);
    }
    return vuetify;
}
