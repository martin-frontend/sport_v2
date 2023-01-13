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
                        yellow: "#FFCD43",
                        red: "#F64D55",
                        green: "#41A81D",
                        bgPage: "#f6f6f4",
                        bgBanner: "#ffffff",
                        bgGray: "#F2F2F2",
                        bgTips: "#F2F2F2",
                        textGray: "#8E8F91",
                        btnPlain: "#0F1213",
                        borderGray: "#E8E8E2",
                    },
                    dark: {
                        yellow: "#FFCD43",
                        red: "#F64D55",
                        green: "#41A81D",
                        bgPage: "#202121",
                        bgBanner: "#272828",
                        bgGray: "#333435",
                        bgTips: "#5A5A5A",
                        textGray: "#8E8F91",
                        btnPlain: "#FFFFFF",
                        borderGray: "#5A5A5A",
                    },
                },
                dark: false,
            },
        };
        vuetify = new Vuetify(opts);
    }
    return vuetify;
}
