import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import page_racing_detail from "../../../page_racing_detail";
import { dateFormat } from "@/core/global/Functions";

@Component
export default class RaceTable extends AbstractView {
    LangUtil = LangUtil;

    isShowContent = true;
    @Prop() option!: any;
    @Prop() tableData!: any;
    @Prop({ default: false }) isNextDay!: boolean;

    headerList = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11", "R12", "R13", "R14"];

    dateFormat() {}

    getEventDate(date: any) {
        return dateFormat(new Date(date), "MM/dd");
    }

    onShowDetail() {
        page_racing_detail.show();
    }

    destroyed() {
        super.destroyed();
    }
}
