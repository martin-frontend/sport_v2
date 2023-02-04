import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import HelpProxy from "../../proxy/HelpProxy";

@Component
export default class GeneralItem extends AbstractView {
    myProxy: HelpProxy = this.getProxy(HelpProxy);
    pageData = this.myProxy.pageData;
    @Prop() data:any;
    mounted(){
        const divScroll: HTMLElement = <any>this.$refs.div;
        if (divScroll) {
            divScroll.innerHTML=this.data;
        }
    }

}
