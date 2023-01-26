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
                        primary: "#8E8F91",
                        yellow: "#ea7800",
                        yellow1: "#FFCD43",
                        red: "#F64D55",
                        green: "#41A81D",
                        bgPage: "#f6f6f4",
                        bgBanner: "#ffffff",
                        bgGray: "#F2F2F2",
                        bgTips: "#F2F2F2",
                        bgMybet: "#F6F6F4",
                        textGray: "#8E8F91",
                        btnPlain: "#3E3714",
                        borderGray: "#E8E8E2",
                        textGray1: "#3E3714",
                        bgColor: "#F6F6F4",
                        bgColor1: "#0F1213",
                    },
                    dark: {
                        primary: "#8E8F91",
                        yellow: "#ea7800",
                        yellow1: "#FFCD43",
                        red: "#F64D55",
                        green: "#41A81D",
                        bgPage: "#202121",
                        bgBanner: "#272828",
                        bgGray: "#333435",
                        bgTips: "#5A5A5A",
                        bgMybet: "#1B1C1C",
                        textGray: "#8E8F91",
                        btnPlain: "#FFFFFF",
                        borderGray: "#5A5A5A",
                        textGray1: "#8E8F91",
                        bgColor: "#202121",
                        bgColor1: "#ffffff",
                    },
                },
                dark: false,
            },
        };
        vuetify = new Vuetify(opts);
    }
    return vuetify;
}
