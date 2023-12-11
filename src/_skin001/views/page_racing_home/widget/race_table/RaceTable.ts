import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import page_racing_detail from "../../../page_racing_detail";
import { dateFormat, getDateByTimeZone } from "@/core/global/Functions";
import PageRacingHomeProxy from "../../proxy/PageRacingHomeProxy";
import GlobalVar from "@/core/global/GlobalVar";
enum type {
    OPEN = "OPEN",
    DONE = "DONE",
    INTERIM = "INTERIM", //临时
    ABANDONED = "ABANDONED", //放弃
    FINAL = "FINAL", //最后
    CLOSED = "CLOSED" //关闭
}
@Component
export default class RaceTable extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageRacingHomeProxy = this.getProxy(PageRacingHomeProxy);
    pageData = this.myProxy.pageData;
    isShowContent = true;
    @Prop() option!: any;
    @Prop() tableData!: any;
    @Prop({ default: false }) isNextDay!: boolean;

    headerList = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11", "R12", "R13", "R14"];

    get isLoading() {
        return this.pageData.loading && this.myProxy.listQueryComp.sport_id.includes(this.option.sportId);
    }

    dateFormat() {}

    getEventDate(date: any) {
        return dateFormat(new Date(date), "MM/dd");
    }

    onShowDetail(match: any) {
        if (!match) return;
        page_racing_detail.show();
    }

    getStartTime(start_time_timestamp: any) {
        return dateFormat(getDateByTimeZone(start_time_timestamp * 1000, <any>GlobalVar.zone), "hh:mm");
    }

    destroyed() {
        super.destroyed();
    }
}
