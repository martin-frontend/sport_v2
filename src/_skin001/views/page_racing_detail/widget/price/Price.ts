import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";

@Component
export default class Price extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    @Prop() price!: any;

    destroyed() {
        super.destroyed();
    }
}
