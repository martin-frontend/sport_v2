import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";

@Component
export default class CountdownTime extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    @Prop() date!: any;
    time: any = "";
    timeId = 0;
    min: any = "";
    sec: any = "";
    updateCountdown() {
        const start_in_sec = this.time - GlobalVar.server_time;
        const hr = Math.floor(start_in_sec / 60 / 60);
        if (hr > 0) return;
        this.min = Math.floor((start_in_sec / 60) % 60);
        this.sec = Math.floor(start_in_sec % 60);
        this.timeId = setInterval(() => {
            this.updateCountdown();
        }, 1000);
    }

    @Watch("date", { immediate: true })
    onWatchData() {
        clearInterval(this.timeId);
        this.time = this.date;
        this.updateCountdown();
    }

    destroyed() {
        clearInterval(this.timeId);
        super.destroyed();
    }
}
