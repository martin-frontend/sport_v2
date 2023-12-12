import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { dateFormat, getDateByTimeZone } from "@/core/global/Functions";

@Component
export default class CountdownTime extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    @Prop() date!: any;
    time: any = "";
    timeId = 0;
    hr = 0;
    min = 0;
    sec = 0;
    updateCountdown() {
        const start_in_sec = this.date - GlobalVar.server_time;
        this.hr = Math.floor(start_in_sec / 60 / 60);
        if (this.hr > 0) {
            this.time = this.getStartTime(this.date);
            clearInterval(this.timeId);
        } else {
            this.min = Math.floor((start_in_sec / 60) % 60);
            this.sec = Math.floor(start_in_sec % 60);
            if (this.min >= 5) {
                this.time = `${this.min}${LangUtil("分钟")}`;
            } else if (this.min > 0) {
                this.time = `${this.min}${LangUtil("分")}${this.sec}${LangUtil("秒")}`;
            } else {
                this.time = `${this.sec}${LangUtil("秒")}`;
            }
        }
    }

    getStartTime(start_time_timestamp: any) {
        return dateFormat(getDateByTimeZone(start_time_timestamp * 1000, <any>GlobalVar.zone), "hh:mm");
    }

    @Watch("date", { immediate: true })
    onWatchData() {
        clearInterval(this.timeId);
        this.timeId = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    destroyed() {
        clearInterval(this.timeId);
        super.destroyed();
    }
}
