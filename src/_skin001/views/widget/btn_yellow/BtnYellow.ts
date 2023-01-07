import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class BtnYellow extends AbstractView {
    LangUtil = LangUtil;
    @Prop({ default: "fit-content" }) width!: number | string;
    @Prop({ default: "auto" }) height!: number | string;
    @Prop({ default: false }) outlined!: boolean;
    @Prop({ default: true }) rounded_tl!: boolean;
    @Prop({ default: true }) rounded_tr!: boolean;
    @Prop({ default: true }) rounded_br!: boolean;
    @Prop({ default: true }) rounded_bl!: boolean;
    @Prop({ default: false }) disabled!: boolean;
    @Prop({ default: 110 }) minWidth!: number;
    @Prop({ default: false }) rounded5!: boolean;
}
