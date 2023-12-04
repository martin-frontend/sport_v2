import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import page_racing_detail from "../../page_racing_detail";

@Component
export default class RaceTable extends AbstractView {
    LangUtil = LangUtil;

    isShowContent = true;
    @Prop() option!: any;
    @Prop({ default: false }) isNextDay!: boolean;

    onShowDetail() {
        page_racing_detail.show();
    }

    destroyed() {
        super.destroyed();
    }
}
