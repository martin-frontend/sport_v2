import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class BtnInfo extends AbstractView {
    LangUtil = LangUtil;
    @Prop({ default: "fit-content" }) width!: number | string;
    @Prop({ default: "auto" }) height!: number | string;
    @Prop({ default: 42 }) minHeight!: number;
    @Prop({ default: 86 }) minWidth!: number;
}
