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
} from "@/core/global/Functions";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import MarketUtils from "@/core/global/MarketUtils";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import SelfProxy from "@/proxy/SelfProxy";
import SettingProxy from "@/proxy/SettingProxy";
import BetProxy from "@/proxy/BetProxy";
import ScrollUtil from "@/core/global/ScrollUtil";

@Component
export default class BetSummary extends AbstractView {
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
    isShowAmountBtns = false;
    able_to_choose_betterodds = this.selfProxy.userInfo.able_to_choose_betterodds;
    keybordarr = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "00", "000"];
    bshowkeybord = false;
    expanded = false;
    allowBetArr = <any>[];

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

    onInput(e: any) {
        let val = parseLocaleNumber(e.target.value);
        val = val.replace(/[^0-9.]/g, "");
        this.updateStake(val);
        this.onStakeChange();
    }
    onMax(e: any) {
        this.pageData.summaryStake = amountFormat(this.maxValue);
        this.onStakeChange();
        this.onBetInputFocus();
    }
    //快捷输入
    onInputFast(stake: any, fastChoose: any) {
        stake = parseLocaleNumber(stake);
        const value = (Number(stake) + parseInt(fastChoose)).toString();
        this.updateStake(value);
        this.onStakeChange();
        this.onBetInputFocus();
    }
    getPlaceholder() {
        if (this.isVisitor) {
            return LangUtil("请输入");
        }
        const p = this.pageData.betType == "single" ? LangUtil("单注限额") : LangUtil("串关限额");
        return p + ` ${this.minStake}-${this.maxStake}`;
    }
    get minStake() {
        if (this.pageData.betType == "single") {
            return Math.max(...this.pageData.list.map((p) => Number(p.minStake))) || 0;
        } else {
            if (this.allowBetArr.length !== this.pageData.list.length) {
                return 0;
            }
            return this.pageData.parlayData.minStake || 0;
        }
    }
    get maxStake() {
        if (this.pageData.betType == "single") {
            return Math.min(...this.pageData.list.map((p) => Number(p.maxStake))) || 0;
        } else {
            if (this.allowBetArr.length !== this.pageData.list.length) {
                return 0;
            }
            return this.pageData.parlayData.maxStake || 0;
        }
    }
    get totalStake() {
        if (this.pageData.betType === "parlay") {
            return Number(parseLocaleNumber(this.pageData.summaryStake)) || 0;
        } else {
            let val = 0;
            const sum = this.pageData.list.reduce(
                (accumulator, currentValue) => accumulator + (Number(parseLocaleNumber(currentValue.stake)) || 0),
                val
            );
            return sum;
        }
    }
    get preWin() {
        let sum = 0;
        if (this.pageData.betType === "parlay") {
            const stake = Number(parseLocaleNumber(this.pageData.summaryStake)) || 0;
            const odds = Number(this.pageData.parlayData.odds);
            sum = odds * stake - stake;
        } else {
            let val = 0;
            sum = this.pageData.list.reduce((accumulator, currentValue) => {
                const value = Number(parseLocaleNumber(currentValue.stake)) || 0;
                const odds = Number(currentValue.odds) || 0;
                const preWin = Number(odds * Number(value) - Number(value));
                return accumulator + preWin;
            }, val);
        }
        return amountFormat(sum.toFixed(3), true, 2);
    }
    get isVisitor() {
        return !this.selfProxy.userInfo || this.selfProxy.userInfo.user_type == 2;
    }

    get maxValue() {
        const gold = parseFloat(this.selfProxy.userInfo.gold) >> 0;
        return Math.min(gold, this.maxStake);
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
    /**投注 */
    onBet() {
        if (this.isVisitor) {
            logEnterTips();
            return;
        }
        const { gold, user_type } = this.selfProxy.userInfo;
        console.warn(">>>>>>>>gold: ", gold);
        // const { selection, market } = this.item;
        if (user_type == 2) {
            logEnterTips();
            return;
        }
        // else if (this.totalStake > parseFloat(gold)) {
        //     this.$notify({
        //         group: "message",
        //         title: LangUtil("余额不足"),
        //     });
        //     return;
        // }

        let result = "";
        // this.myProxy.pageData.list.forEach((item) => {
        //     if (Number(item.stake) < Number(item.minStake) || Number(item.stake) > Number(item.maxStake)) {
        //         result = LangUtil("请确认投注限额");
        //         return;
        //     } else if (item.stake == "") {
        //         result = LangUtil("确认投注额");
        //         return;
        //     }
        // });
        if (result == "") {
            this.myProxy.api_user_betfix_v3(this.totalStake, this.selfProxy.userInfo.better_odds);
        } else {
            this.$notify({
                group: "message",
                title: result,
            });
        }
    }

    get bBetter() {
        return this.selfProxy.userInfo.better_odds == 1;
    }
    set bBetter(better: boolean) {
        better ? (this.selfProxy.userInfo.better_odds = 1) : (this.selfProxy.userInfo.better_odds = 0);
    }
    onInput_mobile(num: string) {
        const stake = parseLocaleNumber(this.pageData.summaryStake);
        const newVal = stake + num;
        this.updateStake(newVal);
        this.onStakeChange();
    }
    onDeleteKeybord(e: any) {
        const mobile = this.$vuetify.breakpoint.mobile;
        if ((mobile && e.type == "touchstart") || (!mobile && e.type == "click")) {
            this.updateStake(this.pageData.summaryStake.slice(0, -1));
            this.onStakeChange();
        }
    }
    //删除注单
    onDelete() {
        this.myProxy.initBetList();
    }

    clearInput() {
        this.pageData.summaryStake = "";
        this.onStakeChange();
        this.onBetInputFocus();
    }

    onStakeChange() {
        this.myProxy.pageData.list.forEach((item) => (item.stake = this.pageData.summaryStake));
    }

    get isAllowBet() {
        const { gold } = this.selfProxy.userInfo;
        if (this.totalStake > parseFloat(gold)) {
            return false;
        }
        this.allowBetArr = [];

        if (this.pageData.betType == "single") {
            let stakeError = false;
            this.myProxy.pageData.list.forEach((item) => {
                const stake = parseLocaleNumber(item.stake);
                if (!stake || stake == ".") {
                    return;
                }
                if (Number(stake) < Number(item.minStake) || Number(stake) > Number(item.maxStake)) {
                    stakeError = true;
                    return;
                }
                this.allowBetArr.push(item);
            });
            return this.allowBetArr.length > 0 && !stakeError;
        } else {
            this.myProxy.pageData.list.forEach((item) => {
                if (item.msg != "") {
                    return;
                }
                this.allowBetArr.push(item);
            });
            const stake = parseLocaleNumber(this.pageData.summaryStake);
            if (
                Number(stake) < Number(this.pageData.parlayData.minStake) ||
                this.pageData.summaryStake === "" ||
                this.pageData.summaryStake === "."
            ) {
                return false;
            }
            return this.allowBetArr.length === this.pageData.list.length;
        }
    }
    clickOdditem() {
        const idx = this.bBetter ? 1 : 0;
        window.localStorage.setItem("better_odds", idx.toString());
        this.selfProxy.userInfo.better_odds = idx;
    }

    get oddsChange() {
        // if (this.pageData.betType == "parlay") {
        //     return this.pageData.parlayData.oddsChange;
        // } else {
        //     return this.myProxy.pageData.list.findIndex((item) => item.oddsChange) > -1;
        // }
        return this.myProxy.pageData.list.findIndex((item) => item.oddsChange) > -1;
    }

    get parlayOdds() {
        let odds = 1;
        this.myProxy.pageData.list.forEach((item: any) => {
            odds *= item.msg ? 1 : this.TransMarketPrice(item.odds);
        });
        return odds.toFixed(2);
    }

    updateStake(val: string) {
        if (val === "" || val === "0") {
            this.pageData.summaryStake = val;
        } else {
            val = val.replace(/[^0-9.]/g, "");
            if (Number(val) >= this.maxValue) {
                val = this.maxValue.toString();
            }
            const parts = val.split(".");
            const integerPart = amountFormat(parts[0]);
            if (parts.length > 1) {
                var decimalPart = parts[1].slice(0, 2);
                this.pageData.summaryStake = integerPart + "." + decimalPart;
            } else {
                this.pageData.summaryStake = integerPart;
            }
        }
    }
}
