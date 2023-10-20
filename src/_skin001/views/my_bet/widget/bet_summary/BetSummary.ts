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
    validateInput,
    isLastCharacterDecimalPoint,
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
        const val = parseLocaleNumber(e.target.value);
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
        if (this.pageData.betType === "single") {
            let val = 0;
            const sum = this.pageData.list.reduce(
                (accumulator, currentValue) => accumulator + Number(parseLocaleNumber(currentValue.stake)),
                val
            );
            return sum;
        } else {
            return Number(parseLocaleNumber(this.pageData.summaryStake));
        }
    }
    get preWin() {
        let sum = 0;
        if (this.pageData.betType === "parlay") {
            const stake = parseLocaleNumber(this.pageData.summaryStake);
            const odds = Number(this.pageData.parlayData.odds);
            sum = odds * Number(stake) - stake;
        } else {
            let val = 0;
            sum = this.pageData.list.reduce((accumulator, currentValue) => {
                const value = parseLocaleNumber(currentValue.stake);
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
        this.updateStake(newVal, num);
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
                if (!stake) {
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
            if (Number(stake) < Number(this.pageData.parlayData.minStake) || this.pageData.summaryStake === "") {
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

    updateStake(val: string, addStr?: string) {
        if (val === "" || val === "0") {
            // console.warn("val1", val);
            this.pageData.summaryStake = val;
        } else if (validateInput(val)) {
            // console.warn("val3", val);
            if (Number(val) === 0) {
                // console.log("val3-1", val);
                this.pageData.summaryStake = val;
            } else if (Number(val) >= this.maxValue) {
                // console.log("val3-2", val);
                this.pageData.summaryStake = this.amountFormat(this.maxValue);
            } else {
                if (isLastCharacterDecimalPoint(val)) {
                    // console.log("val3-3", val);
                    this.pageData.summaryStake = this.amountFormat(val) + ".";
                } else {
                    // console.log("val3-4", val);
                    const parts = val.split(".");
                    const integerPart = parts[0]; // 整数部分
                    const decimalPart = parts[1] !== undefined ? "." + parts[1] : ""; // 小数部分
                    this.pageData.summaryStake = this.amountFormat(integerPart) + decimalPart;
                }
            }
        } else {
            // console.warn("val4", val);
            let deleteLength = 1;
            if (addStr) {
                deleteLength = addStr.length;
            }
            val = val.slice(0, deleteLength * -1);
            const parts = val.split(".");
            const integerPart = parts[0]; // 整数部分
            const decimalPart = parts[1] !== undefined ? "." + parts[1] : ""; // 小数部分
            this.pageData.summaryStake = this.amountFormat(integerPart) + decimalPart;
        }
    }
}
