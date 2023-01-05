import Vue from "vue";
import AbstractView from "@/core/abstract/AbstractView";
import { Component } from "vue-property-decorator";
import GlobalVar from "@/core/global/GlobalVar";
@Component
export default class APP extends AbstractView {
    GlobalVar = GlobalVar;

    mounted(){
        setInterval(()=>{
            Vue.notify({
                group: "message",
                title: "hello world",
                data: {msg: "xxxxxxxx"}
            })
        }, 5000);
    }
}
