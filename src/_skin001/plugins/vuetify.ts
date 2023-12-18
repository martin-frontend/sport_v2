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
                        red: "#FF3C30",
                        green: "#00C22B",
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
                        textYellow: "#3E3714",
                        iconHeaderColor: "#FFF9e5",
                        textTagBtn: "#5C5C5C",
                        textGoldBg: "#F6BF4D",
                        textBet: "#3E3714",
                        helpColor: "#666666",
                        competBC: "#f5f5f4",
                        errorMsgBg: "#fff4e5",
                        betSummaryBg: "#ffffff",
                        tagTextColor1: "#5d5d5d",
                        tagTextColor2: "#0f1213",
                        tagTextColor3: "#febc08",
                        tableHeaderColor: "#f7f8fa",
                        timeColor1: "#eb7d00",
                        timeColor2: "#0f1213",
                        headerTextColor: "#919191",
                        textGray2: "#0F1213",
                    },
                    dark: {
                        competBC: "#1e1e1e",
                        primary: "#8E8F91",
                        yellow: "#ea7800",
                        yellow1: "#FFCD43",
                        red: "#FF3C30",
                        green: "#00C22B",
                        bgPage: "#202121",
                        bgBanner: "#272828",
                        bgGray: "#333435",
                        bgTips: "#5A5A5A",
                        bgMybet: "#1e1e1e",
                        textGray: "#8E8F91",
                        btnPlain: "#FFFFFF",
                        borderGray: "#5A5A5A",
                        textGray1: "#8E8F91",
                        bgColor: "#202121",
                        bgColor1: "#ffffff",
                        textYellow: "#3E3714",
                        iconHeaderColor: "#ffffff",
                        textTagBtn: "#ffffff",
                        textGoldBg: "#303030",
                        textBet: "#8E8F91",
                        helpColor: "#ffffff",
                        errorMsgBg: "#3d3522",
                        betSummaryBg: "#3e3f41",
                        tagTextColor1: "#8e8f91",
                        tagTextColor2: "#ebebeb",
                        tagTextColor3: "#febc08",
                        tableHeaderColor: "#3e3f41",
                        timeColor1: "#eb7d00",
                        timeColor2: "#8e8f91",
                        headerTextColor: "#919191",
                        textGray2: "#0F1213",
                    },
                },
                dark: false,
            },
        };
        vuetify = new Vuetify(opts);
    }
    return vuetify;
}
