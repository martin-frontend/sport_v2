import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class LoadMore extends AbstractView {
    LangUtil = LangUtil;
    @Prop() finished!: any;
    @Prop({ default: "listbox-mobile" }) _class!: string;
    @Prop({ default: false }) listNodata!: boolean;

    onRefresh(done: any) {
        this.$emit("onRefresh", done);
    }

    onLoad(done: any) {
        this.$emit("onLoad", done);
    }
}
