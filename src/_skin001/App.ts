import Vue from "vue";
import AbstractView from "@/core/abstract/AbstractView";
import { Component, Watch } from "vue-property-decorator";
import GlobalVar from "@/core/global/GlobalVar";
@Component
export default class APP extends AbstractView {
    GlobalVar = GlobalVar;

    constructor(){
        super();
        this.onWatchTheme();
    }

    mounted(){
        // setInterval(()=>{
        //     Vue.notify({
        //         group: "message",
        //         title: "hello world",
        //         data: {msg: "xxxxxxxx"}
        //     })
        // }, 5000);
        this.onWatchTheme();
    }

    @Watch("$vuetify.theme.dark")
    onWatchTheme() {
        const html: HTMLElement = <any>document.getElementsByTagName("html")[0];
        html.style.backgroundColor = this.$vuetify.theme.dark ? "#202121" : "#f6f6f4";
    }
}
