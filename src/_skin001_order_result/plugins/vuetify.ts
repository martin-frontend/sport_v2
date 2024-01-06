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
                        primary: "#0f1213",
                        yellow: "#ea7800",
                        baclground_bg: "#f4f4f4",
                        item_bg: "#ffffff",
                        textGray: "#5d5d5d",
                        blue: "#0325b4",
                    },
                    dark: {
                        primary: "#fff",
                        yellow: "#ea7800",
                        baclground_bg: "#f4f4f4",
                        item_bg: "#ffffff",
                        textGray: "#5d5d5d",
                        blue: "#0325b4",
                    },
                },
                dark: false,
            },
        };
        vuetify = new Vuetify(opts);
    }
    return vuetify;
}
