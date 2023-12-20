import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import {
    amountFormat,
    TransMarketPrice,
    formatEventTime,
    dateFormat,
    getDateByTimeZone,
    parseLocaleNumber,
    logEnterTips,
    getDecimalSeparator,
} from "@/core/global/Functions";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import MarketUtils from "@/core/global/MarketUtils";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import SelfProxy from "@/proxy/SelfProxy";
import SettingProxy from "@/proxy/SettingProxy";
import BetProxy from "@/proxy/BetProxy";
import ScrollUtil from "@/core/global/ScrollUtil";
import Vue from "vue";
import SportUtil from "@/core/global/SportUtil";
import Assets from "@/_skin001/assets/Assets";

@Component
export default class BetItem extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    MarketUtils = MarketUtils;
    OrderTitleUtils = OrderTitleUtils;
    amountFormat = amountFormat;
    TransMarketPrice = TransMarketPrice;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    settintProxy: SettingProxy = getProxy(SettingProxy);
    myProxy: BetProxy = this.getProxy(BetProxy);
    pageData = this.myProxy.pageData;
    bshowkeybord = false;
    oldStake = "";
    // keybordarr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "00", "."];
    @Prop() item!: any;
    @Prop() betType!: any;

    iconOdds = "arrow_up";
    cleartimer = 0;
    // bBetter = this.selfProxy.userInfo.better_odds == 1;
    able_to_choose_betterodds = this.selfProxy.userInfo.able_to_choose_betterodds;
    expanded = false;
    isShowAmountBtns = false;
    decimalSeparator = getDecimalSeparator();
    sportIcon = Assets.SportIcon;
    isRaceEvent = SportUtil.isRaceEvent;
    @Watch("bshowkeybord")
    onWatchShowKeyboard() {
        // 键盘打开后，向上滚动，露出投注按扭
        if (this.bshowkeybord) {
            const divboxMyBet = document.getElementById("divboxMyBet");
            if (divboxMyBet) {
                ScrollUtil(divboxMyBet, 1000);
            }
        }
    }
    get bBetter() {
        return this.selfProxy.userInfo.better_odds == 1;
    }
    set bBetter(better: boolean) {
        better ? (this.selfProxy.userInfo.better_odds = 1) : (this.selfProxy.userInfo.better_odds = 0);
    }
    clickOdditem() {
        const idx = this.bBetter ? 1 : 0;
        window.localStorage.setItem("better_odds", idx.toString());
        this.selfProxy.userInfo.better_odds = idx;
    }
    @Watch("item.odds")
    onWatchOdds() {
        const divPrice: HTMLElement = <any>this.$refs.divPrice;
        const imgOdds: HTMLElement = <any>this.$refs.imgOdds;
        if (divPrice && imgOdds && this.item.oldOdds) {
            if (this.item.odds > this.item.oldOdds) {
                this.iconOdds = "arrow_up";
                divPrice.style.color = GlobalVar.color_up;
                imgOdds.style.opacity = "1";
                imgOdds.style.color = GlobalVar.color_up;
                imgOdds.classList.add("animation-translate");
            } else {
                this.iconOdds = "arrow_down";
                divPrice.style.color = GlobalVar.color_down;
                imgOdds.style.opacity = "1";
                imgOdds.style.color = GlobalVar.color_down;
                imgOdds.classList.add("animation-translate");
            }
            this.clearOddsStatus();
        }
    }
    handleInputClick() {
        this.bshowkeybord = true;
    }
    clearOddsStatus() {
        clearTimeout(this.cleartimer);
        const imgOdds: HTMLElement = <any>this.$refs.imgOdds;
        const divPrice: HTMLElement = <any>this.$refs.divPrice;
        if (imgOdds && divPrice) {
            this.cleartimer = setTimeout(() => {
                imgOdds.style.opacity = "0";
                imgOdds.classList.remove("animation-translate");
                divPrice.style.color = this.$vuetify.theme.dark ? "#8E8F91" : "#8E8F91";
            }, 5000);
        }
    }

    transTitle(title: any) {
        const homestr = LangUtil("主队").trim();
        const awaystr = LangUtil("客队").trim();
        const { home_team, away_team } = this.item.matche;
        title = title.replace(new RegExp(homestr, "ig"), home_team).replace(new RegExp(awaystr, "ig"), away_team);
        return title;
    }
    get states() {
        return this.pageData.event_states.find((item1) => item1.event_id == this.item.matche.id);
    }

    getStartTime() {
        return formatEventTime(dateFormat(getDateByTimeZone(this.item.matche.sb_time * 1000, <any>GlobalVar.zone), "yyyy/MM/dd hh:mm:ss"));
    }

    getDay(): number {
        const time = this.item.matche.sb_time - GlobalVar.server_time;
        return Math.floor(time / 60 / 60 / 24);
    }
    getHour(): number {
        const time = this.item.matche.sb_time - GlobalVar.server_time;
        return Math.floor(time / 60 / 60);
    }
    getMinute(): number {
        const time = this.item.matche.sb_time - GlobalVar.server_time;
        return Math.floor((time / 60) % 60);
    }

    //赛事进程
    getStats() {
        const market_type = this.item.market.market_type;
        return `${OrderTitleUtils.getScoreStr({
            market_type: market_type,
            state: this.states,
        })}`;
    }
    //检测是否为滚球
    checkInplay() {
        return !!this.states && !!this.states.goals_ft;
    }

    onInput(e: any) {
        let val = parseLocaleNumber(e.target.value);
        this.updateStake(val);
    }
    onInput_mobile(num: string) {
        const stake = this.item.stake + num;
        const newVal = parseLocaleNumber(stake);
        this.updateStake(newVal);
    }
    onDeleteKeybord(e: any) {
        const mobile = this.$vuetify.breakpoint.mobile;
        if ((mobile && e.type == "touchstart") || (!mobile && e.type == "click")) {
            const stake = parseLocaleNumber(this.item.stake.slice(0, -1));
            this.updateStake(stake);
        }
    }
    //快捷输入
    onInputFast(stake: any, fastChoose: any) {
        stake = parseLocaleNumber(stake);
        const value = (Number(stake) + parseInt(fastChoose)).toString();
        this.updateStake(value);
        this.onBetInputFocus();
    }
    //删除注单
    onDelete() {
        this.myProxy.deleteItem(this.item.market.market_id, this.item.selection.id);
    }
    get isAllowBet() {
        const stakeValue = Number(parseLocaleNumber(this.item.stake)) || 0;
        const { gold } = this.selfProxy.userInfo;
        const { selection, market } = this.item;
        return (
            this.item.stake &&
            stakeValue >= Number(this.item.minStake) &&
            stakeValue <= Number(this.item.maxStake) &&
            stakeValue <= parseFloat(gold)
        );
    }
    /**投注 */
    onBet() {
        if (this.isVisitor) {
            logEnterTips();
            return;
        }
        const stakeValue = Number(parseLocaleNumber(this.item.stake)) || 0;
        const { gold, user_type } = this.selfProxy.userInfo;
        console.warn(">>>>>>>>gold: ", gold);
        const { selection, market } = this.item;
        if (user_type == 2) {
            logEnterTips();
            return;
        } else if (stakeValue < Number(this.item.minStake) || stakeValue > Number(this.item.maxStake)) {
            this.$notify({
                group: "message",
                title: LangUtil("请确认投注限额"),
            });
        } else if (stakeValue > parseFloat(gold)) {
            this.$notify({
                group: "message",
                title: LangUtil("余额不足"),
            });
        } else if (!this.item.stake) {
            this.$notify({
                group: "message",
                title: LangUtil("确认投注额"),
            });
        } else {
            // this.myProxy.api_user_betfix(market.market_id, selection.id, this.selfProxy.userInfo.better_odds);
            this.myProxy.api_user_betfix_v3(stakeValue, this.selfProxy.userInfo.better_odds);
        }
    }

    onMax(e: any) {
        this.item.stake = amountFormat(this.maxValue);
        this.onBetInputFocus();
    }

    getPreWin() {
        const value = Number(parseLocaleNumber(this.item.stake)) || 0;
        return amountFormat((this.item.odds * value - value).toFixed(3), true, 2);
    }
    /**解决键盘点击太快留下残影的bug */
    timer_remove_ripple = 0;
    onTouchEnd(e: any) {
        const element: any = e.currentTarget as HTMLElement | null;
        if (!element || !element._ripple) return;

        window.clearTimeout(element._ripple.showTimer);

        clearTimeout(this.timer_remove_ripple);
        const eles: HTMLElement[] = <any>document.getElementsByClassName("v-ripple__container");
        this.timer_remove_ripple = setTimeout(() => {
            for (let i = 0; i < eles.length; i++) {
                const ele = eles[i];
                if (ele && ele.parentNode) {
                    ele.parentNode.removeChild(ele);
                }
            }
        }, 200);
    }
    get isVisitor() {
        return !this.selfProxy.userInfo || this.selfProxy.userInfo.user_type == 2;
    }

    getPlaceholder(item: any) {
        if (this.isVisitor) {
            return LangUtil("请输入");
        }
        return LangUtil("单注限额") + ` ${amountFormat(item.minStake) || 0}-${amountFormat(item.maxStake) || 0}`;
    }

    onClickOutside() {
        this.isShowAmountBtns = false;
        this.bshowkeybord = false;
    }

    onBetInputFocus() {
        //@ts-ignore
        this.$refs.betInput?.focus();
    }

    onFocus() {
        this.isShowAmountBtns = true;
    }

    get maxValue() {
        const gold = parseFloat(this.selfProxy.userInfo.gold);
        return Math.min(gold, Number(this.item.maxStake) || 0);
    }

    clearInput() {
        this.item.stake = "";
        this.onBetInputFocus();
    }

    updateStake(val: string) {
        if (val === "" || val === "0") {
            this.item.stake = val;
        } else {
            val = val.replace(/[^0-9.]/g, "");
            if (Number(val) >= this.maxValue) {
                val = this.maxValue.toString();
            }
            const parts = val.split(".");
            const integerPart = amountFormat(parts[0]);
            if (parts.length > 1) {
                var decimalPart = parts[1].slice(0, 2);
                this.item.stake = integerPart + this.decimalSeparator + decimalPart;
            } else {
                this.item.stake = integerPart;
            }
        }
    }
    get keybordarr() {
        return ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "00", this.decimalSeparator];
    }

    getRaceTime(date: any) {
        return dateFormat(getDateByTimeZone(date * 1000, <any>GlobalVar.zone), "yyyy/MM/dd hh:mm:ss");
    }
}
