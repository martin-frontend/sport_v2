import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LiveMediator from "../mediator/LiveMediator";
import LiveProxy from "../proxy/LiveProxy";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { formatEventTime, dateFormat, getDateByTimeZone, getResponseIcon, logEnterTips, getFullTime } from "@/core/global/Functions";
import SelfProxy from "@/proxy/SelfProxy";
import getProxy from "@/core/global/getProxy";
import SkinVariable from "@/core/SkinVariable";
import SportUtil from "@/core/global/SportUtil";

@Component
export default class Live extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    getResponseIcon = getResponseIcon;
    myProxy: LiveProxy = this.getProxy(LiveProxy);
    pageData = this.myProxy.pageData;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    bShowTime = false; //是否显示倒计时
    @Prop({ default: 0 }) value!: number;
    window = this.value;
    iframeHeight = 0;
    user_type: number = this.selfProxy.userInfo.user_type;
    isShowLive = [0];
    isRaceEvent = SportUtil.isRaceEvent;

    @Watch("value")
    onWatchValue() {
        this.window = this.value;
    }
    @Watch("myProxy.pageData.loading")
    onWatchLoading() {
        if (!this.myProxy.pageData.loading) {
            this.isShowLive = [0];
        }
    }

    @Watch("window")
    onWatchWindow() {
        setTimeout(() => {
            this.onWatchWidth();
        }, 100);
    }

    get curSportId() {
        return this.myProxy.listQueryComp.sport_id;
    }

    mounted() {
        this.onWatchWidth();
    }

    constructor() {
        super(LiveMediator);
    }

    onScroll(e: any) {
        this.bShowTime = e.target.scrollTop > 160;
    }

    @Watch("$vuetify.breakpoint.width")
    onWatchWidth() {
        const divbox = this.$refs.divbox;
        const ifr: any = this.$refs.ifr;
        if (divbox && ifr) {
            //@ts-ignore
            this.iframeHeight = (divbox.$el.getBoundingClientRect().width * 290) / 400;
        }
    }

    get matche() {
        return this.pageData.competition_list[0]?.matches[0];
    }

    get start_time() {
        return dateFormat(getDateByTimeZone(this.matche.sb_time * 1000, <any>GlobalVar.zone), "MM/dd hh:mm" ,true);
    }

    getCompName() {
        return this.pageData.competition_list[0]?.competition_name;
    }
    getHomeName() {
        return this.pageData.competition_list[0]?.matches[0]?.home_team;
    }
    getAwayName() {
        return this.pageData.competition_list[0]?.matches[0]?.away_team;
    }
    getHomeIcon() {
        return this.getResponseIcon(this.pageData.competition_list[0]?.matches[0]?.home_team_icon);
    }
    getAwayIcon() {
        return this.getResponseIcon(this.pageData.competition_list[0]?.matches[0]?.away_team_icon);
    }

    getStates() {
        return this.pageData.event_states[0];
    }

    get goalsValue(): number[] {
        if (this.getStates()?.goals_ft) {
            return this.getStates()
                .goals_ft.split("-")
                .map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    get goals_ot_Value(): number[] {
        if (this.getStates()?.goals_ot) {
            return this.getStates()
                .goals_ot.split("-")
                .map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    get goals_pk_Value(): number[] {
        if (this.getStates()?.goals_pk) {
            return this.getStates()
                .goals_pk.split("-")
                .map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    split_goals(goals: string) {
        const goalarr = goals.split("-");
        return goalarr.length == 2 ? goalarr : [0, 0];
    }

    /**是否显示全场比分，or加时比分 */
    isShowFullScore(): boolean {
        const arr = ["-", "1H", "HT", "2H", "FT"];
        return !arr.includes(this.getStates().match_phase);
    }
    /**是否显示点球比分 */
    isShowPK(): boolean {
        const arr = ["PK", "PK FT"];
        return arr.includes(this.getStates().match_phase);
    }
    /**获取倒计时数据 */
    getDowncount(): string[] {
        let str = "";
        const start_in_sec = this.matche.sb_time - GlobalVar.server_time;
        const day = Math.floor(start_in_sec / 60 / 60 / 24);
        const hr = Math.floor(start_in_sec / 60 / 60 - day * 24);
        const min = Math.floor((start_in_sec / 60) % 60);
        const sec = Math.floor(start_in_sec % 60);

        if (day < 10) str += "0";
        str += day;
        if (hr < 10) str += "0";
        str += hr;
        if (min < 10) str += "0";
        str += min;
        if (sec < 10) str += "0";
        str += sec;
        return str.split("");
    }
    get downTime(): any {
        const start_in_sec = this.matche.sb_time - GlobalVar.server_time;
        const day = Math.floor(start_in_sec / 60 / 60 / 24);
        const hr = Math.floor(start_in_sec / 60 / 60 - day * 24);
        const min = Math.floor((start_in_sec / 60) % 60);
        const sec = Math.floor(start_in_sec % 60);

        return { day, hr, min, sec };
    }
    clicklive() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        this.window = 1;
    }
    clickAnim() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        this.window = 2;
    }
    destroyed() {
        super.destroyed();
    }
    getFullTime(match_phase: any, phase_minute: any) {
        if (SkinVariable.skin == "skin001_1") {
            return getFullTime(match_phase, phase_minute);
        }
        return phase_minute;
    }
}
