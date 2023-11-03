import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
// import LiveMediator from "../mediator/LivePlayerMediator";
// import LivePlayerProxy from "../proxy/LivePlayerProxy";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { formatEventTime, dateFormat, getDateByTimeZone, getResponseIcon, logEnterTips, getFullTime } from "@/core/global/Functions";
import SelfProxy from "@/proxy/SelfProxy";
import getProxy from "@/core/global/getProxy";
import SkinVariable from "@/core/SkinVariable";
import BetProxy from "@/proxy/BetProxy";
import OrderUnsettledProxy from "@/proxy/OrderUnsettledProxy";
import DialogBetResultProxy from "../../dialog_bet_result/proxy/DialogBetResultProxy";
import LiveProxy from "../../live/proxy/LiveProxy";
import MatcheProxy from "../../matche/proxy/MatcheProxy";

@Component
export default class LivePlayer extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    getResponseIcon = getResponseIcon;
    myProxy: LiveProxy = this.getProxy(LiveProxy);
    betProxy: BetProxy = this.getProxy(BetProxy);
    pageData = this.myProxy.pageData;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    matcheProxy: MatcheProxy = this.getProxy(MatcheProxy);
    bShowTime = false;
    isFullscreen = false;
    isShowBetBtn = true;
    orderUnsettledProxy: OrderUnsettledProxy = getProxy(OrderUnsettledProxy);
    betResultProxy: DialogBetResultProxy = getProxy(DialogBetResultProxy);
    window = 0;

    fullscreen(type: boolean) {
        this.isFullscreen = type;
        this.betProxy.initBetList();
        this.betProxy.pageData.isLive = type;
        if(!type) {
            this.isShowBetBtn = true;
        }
    }

    @Watch("window")
    onWatchWindow(newVal: any, oldVal: any) {
        this.betProxy.pageData.isShowResultPanel = newVal == 1;
        if (oldVal == 1) {
            this.betResultProxy.pageData.bShow = false;
        }
    }

    @Watch("betResultProxy.pageData.bShow")
    onWatchBetResultShow() {
        if (this.betResultProxy.pageData.bShow) {
            this.window = 1;
        }
    }

    @Watch("betProxy.pageData.activeCount")
    onWatchMyBet() {
        if (this.betResultProxy.pageData.bShow) {
            return;
        }
        if (this.betProxy.pageData.list.length == 0) {
            this.window = 1;
        } else {
            this.window = 0;
        }
    }

    getCompName() {
        return this.pageData.competition_list[0]?.competition_name;
    }
    
    getStates() {
        return this.pageData.event_states[0];
    }

    getFullTime(match_phase: any, phase_minute: any) {
        if (SkinVariable.skin == "skin001_1") {
            return getFullTime(match_phase, phase_minute);
        }
        return phase_minute;
    }
    getHomeName() {
        return this.matcheProxy.pageData.competition_list[0]?.matches[0]?.home_team;
    }
    getAwayName() {
        return this.matcheProxy.pageData.competition_list[0]?.matches[0]?.away_team;
    }
    getCurrMatche() {
        return this.matcheProxy.pageData.competition_list[0]?.matches[0];
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
    get goalsValue(): number[] {
        if (this.getStates()?.goals_ft) {
            return this.getStates()
                .goals_ft.split("-")
                .map((item: any) => parseInt(item));
        } else {
            return [0, 0];
        }
    }
}
