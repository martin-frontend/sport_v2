import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import LiveMediator from "../mediator/LiveMediator";
import LiveProxy from "../proxy/LiveProxy";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { formatEventTime, dateFormat, getDateByTimeZone } from "@/core/global/Functions";

@Component
export default class Live extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    myProxy: LiveProxy = this.getProxy(LiveProxy);
    pageData = this.myProxy.pageData;

    window = 0;

    constructor() {
        super(LiveMediator);
    }

    get matche() {
        return this.pageData.competition_list[0]?.matches[0];
    }

    get start_time() {
        return dateFormat(getDateByTimeZone(this.matche.sb_time * 1000, <any>GlobalVar.zone), "MM/dd hh:mm");
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
        return this.pageData.competition_list[0]?.matches[0]?.home_team_icon;
    }
    getAwayIcon() {
        return this.pageData.competition_list[0]?.matches[0]?.away_team_icon;
    }

    getStates() {
        return this.pageData.event_states[0];
    }

    get goalsValue(): number[] {
        if (this.getStates()) {
            return this.getStates()
                .goals_ft.split("-")
                .map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    get goals_ot_Value(): number[] {
        if (this.getStates()) {
            return this.getStates()
                .goals_ot.split("-")
                .map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    get goals_pk_Value(): number[] {
        if (this.getStates()) {
            return this.getStates()
                .goals_pk.split("-")
                .map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
    split_goals(goals: string) {
        const goalarr = goals.split("-");
        return goalarr;
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

    destroyed() {
        super.destroyed();
    }
}
