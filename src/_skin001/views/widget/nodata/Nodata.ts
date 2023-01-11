import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class Nodata extends AbstractView {
    LangUtil = LangUtil;
    @Prop({ default: 131 }) height!: number;
}
