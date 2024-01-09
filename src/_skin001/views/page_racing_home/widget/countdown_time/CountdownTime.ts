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
    @Prop({ default: 20 }) height!: any;
    @Prop() width!: any;
    @Prop({ default: 12 }) fontSize!: any;
    @Prop() backgroundColor!: string;
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
            this.min = Math.floor((Math.abs(start_in_sec) / 60) % 60);
            if (start_in_sec < 0) {
                this.min *= -1;
            }
            this.sec = Math.floor(start_in_sec % 60);
            if (this.min >= 5) {
                this.time = `${this.min}${LangUtil("race分钟")}`;
            } else if (this.min > 0 || this.min < 0) {
                this.time = `${this.min}${LangUtil("分")}${Math.abs(this.sec)}${LangUtil("秒")}`;
            } else {
                this.time = `${this.sec}${LangUtil("秒")}`;
            }
        }
    }

    getStartTime(start_time_timestamp: any) {
        return dateFormat(getDateByTimeZone(start_time_timestamp * 1000, <any>GlobalVar.zone), "hh:mm");
    }

    @Watch("date", { immediate: true })
    onWatchDate(val: any) {
        if (!val) return;
        clearInterval(this.timeId);
        this.updateCountdown();
        this.timeId = setInterval(this.updateCountdown, 1000);
    }

    destroyed() {
        clearInterval(this.timeId);
        super.destroyed();
    }
    get getBackgroundColor() {
        if (this.backgroundColor) {
            return this.backgroundColor;
        }

        if (this.min >= 5) {
            return "timeColor2";
        }
        if (this.sec <= 0 && this.min <= 0) {
            return "red";
        }
        return "timeColor1";
    }
    get getTextColor() {
        if (this.backgroundColor) {
            console.warn("----min ", this.min);
            if (this.min < 5 || (this.sec <= 0 && this.min <= 0)) {
                return "red--text";
            }
            return "primary--text";
        }
        if (this.min >= 5 && this.$vuetify.theme.dark) {
            return " textGray2--text";
        }
        if (this.min >= 5 && !this.$vuetify.theme.dark) {
            return "bgBanner--text";
        }
        if (this.min < 5 || (this.sec <= 0 && this.min <= 0)) {
            return "white--text";
        }

        return "primary--text";
    }
}
