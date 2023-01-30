import Vue from "vue";
import AbstractView from "@/core/abstract/AbstractView";
import { Component, Watch } from "vue-property-decorator";
import GlobalVar from "@/core/global/GlobalVar";
import dialog_message_box from "./views/dialog_message_box";
import { EnumPostMessage } from "@/enum/EnumPostMessage";
import { js_utils } from "custer-js-utils";
@Component
export default class APP extends AbstractView {
    GlobalVar = GlobalVar;

    constructor() {
        super();
    }

    mounted() {
        this.$vuetify.theme.dark = js_utils.getQueryVariable("dark") == 'true' ?? false;
        this.onWatchTheme();
        window.addEventListener("message", (e) => {
            switch (e.data) {
                case EnumPostMessage.DARK:
                    this.$vuetify.theme.dark = true;
                    break;
                case EnumPostMessage.LIGHT:
                    this.$vuetify.theme.dark = false;
                    break;
            }
        });
    }

    @Watch("$vuetify.theme.dark")
    onWatchTheme() {
        const html: HTMLElement = <any>document.getElementsByTagName("html")[0];
        html.style.backgroundColor = this.$vuetify.theme.dark ? "#202121" : "#f6f6f4";
    }
}
