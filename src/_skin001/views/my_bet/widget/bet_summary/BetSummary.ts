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

    onInput() {
        const newVal = this.pageData.summaryStake.replace(/[^\d]/g, "");
        this.pageData.summaryStake = amountFormat(Math.min(Number(newVal), this.maxValue));
        this.onStakeChange();
    }
    onMax(e: any) {
        const newVal = Math.min(parseFloat(this.selfProxy.userInfo.gold) >> 0, this.maxStake).toString();
        this.pageData.summaryStake = amountFormat(newVal.replace(/[^\d]/g, ""));
        this.onStakeChange();
        this.onBetInputFocus();
    }
    //快捷输入
    onInputFast(stake: any, fastChoose: any) {
        stake = parseLocaleNumber(stake || "0");
        let value = (stake + parseInt(fastChoose)).toString();
        value = value.replace(/[^\d]/g, "");
        this.pageData.summaryStake = amountFormat(Math.min(value, this.maxValue));
        this.onStakeChange();
        this.onBetInputFocus();
    }
    getPlaceholder() {
        if (this.isVisitor) {
            return LangUtil("请输入");
        }
        return LangUtil("单注限额") + ` ${this.minStake || "-"}-${this.maxStake || "-"}`;
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
            return Number(this.pageData.summaryStake) || 0;
        }
        let val = 0;
        const sum = this.pageData.list.reduce(
            (accumulator, currentValue) => accumulator + (parseLocaleNumber(currentValue.stake) || 0),
            val
        );
        return sum;
    }
    get preWin() {
        let val = 0;
        const sum = this.pageData.list.reduce((accumulator, currentValue) => {
            const value = parseLocaleNumber(currentValue.stake);
            const price = Number(currentValue.selection.price.back) || 0;
            const preWin = Number(price * value - value);
            return accumulator + preWin;
        }, val);

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
        const stake = parseLocaleNumber(this.pageData.summaryStake || "0");
        const newVal = Number(stake + num);
        this.pageData.summaryStake = amountFormat(Math.min(newVal, this.maxValue));
        this.onStakeChange();
    }
    onDeleteKeybord(e: any) {
        const mobile = this.$vuetify.breakpoint.mobile;
        if ((mobile && e.type == "touchstart") || (!mobile && e.type == "click")) {
            let stake: any = Math.floor(Number(parseLocaleNumber(this.pageData.summaryStake || "0")) / 10);
            stake = amountFormat(stake);
            this.pageData.summaryStake = stake == "0" ? "" : stake;
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
            this.myProxy.pageData.list.forEach((item) => {
                if (item.stake == "") {
                    return;
                }
                if (Number(item.stake) < Number(item.minStake) || Number(item.stake) > Number(item.maxStake)) {
                    return;
                }
                this.allowBetArr.push(item);
            });
            return this.allowBetArr.length > 0;
        } else {
            this.myProxy.pageData.list.forEach((item) => {
                if (item.msg != "") {
                    return;
                }
                this.allowBetArr.push(item);
            });
            if (this.pageData.summaryStake == "") return false;
            return this.allowBetArr.length === this.pageData.list.length;
        }
    }
}
