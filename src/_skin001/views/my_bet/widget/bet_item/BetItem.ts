import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { amountFormat, TransMarketPrice, formatEventTime, dateFormat, getDateByTimeZone } from "@/core/global/Functions";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import MarketUtils from "@/core/global/MarketUtils";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import SelfProxy from "@/proxy/SelfProxy";
import SettingProxy from "@/proxy/SettingProxy";
import BetProxy from "@/proxy/BetProxy";

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

    @Prop() item!: any;

    iconOdds = "arrow_up";
    cleartimer = 0;

    @Watch("item.odds")
    onWatchOdds() {
        const divPrice: HTMLElement = <any>this.$refs.divPrice;
        const imgOdds: HTMLElement = <any>this.$refs.imgOdds;
        if (divPrice && imgOdds && this.item.oldOdds) {
            if (this.item.odds > this.item.oldOdds) {
                this.iconOdds = "arrow_up";
                divPrice.style.color = "#F64D55";
                imgOdds.style.opacity = "1";
                imgOdds.style.color = "#F64D55";
                imgOdds.classList.add("animation-translate");
            } else {
                this.iconOdds = "arrow_down";
                divPrice.style.color = "#41A81D";
                imgOdds.style.opacity = "1";
                imgOdds.style.color = "#41A81D";
                imgOdds.classList.add("animation-translate");
            }
            this.clearOddsStatus();
        }
    }

    clearOddsStatus(){
        clearTimeout(this.cleartimer);
        const imgOdds: HTMLElement = <any>this.$refs.imgOdds;
        const divPrice: HTMLElement = <any>this.$refs.divPrice;
        if(imgOdds && divPrice){
            this.cleartimer = setTimeout(() => {
                imgOdds.style.opacity = "0";
                imgOdds.classList.remove("animation-translate");
                divPrice.style.color = this.$vuetify.theme.dark ? "#8E8F91" : "#8E8F91";
            }, 5000);
        }
    }

    onInput() {
        this.item.stake = amountFormat(this.item.stake.replace(/[^\d]/g, ""));
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
        return `${OrderTitleUtils.getScoreStr({ market_type: market_type, state: this.states })}`;
    }
    //检测是否为滚球
    checkInplay() {
        return !!this.states && !!this.states.goals_ft;
    }
    //快捷输入
    onInputFast(stake: any, fastChoose: any) {
        const value = ((stake ? parseInt(stake.replace(/,/g, "")) : 0) + parseInt(fastChoose)).toString();
        return amountFormat(value.replace(/[^\d]/g, ""));
    }
    //删除注单
    onDelete() {
        this.myProxy.deleteItem(this.item.market.market_id, this.item.selection.id);
    }
    /**投注 */
    onBet() {
        const { gold } = this.selfProxy.userInfo;
        console.warn(">>>>>>>>gold: ", gold);
        const { selection, market } = this.item;
        const stakeValue = parseFloat(this.item.stake.replace(/,/g, ""));
        if (stakeValue < <any>this.item.minStake || stakeValue > <any>this.item.maxStake) {
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
            this.myProxy.api_user_betfix(market.market_id, selection.id);
        }
    }

    onMax() {
        this.item.stake = Math.min(parseFloat(this.selfProxy.userInfo.gold) >> 0, this.item.maxStake).toString();
        this.item.stake = amountFormat(this.item.stake.replace(/[^\d]/g, ""));
    }

    getPreWin() {
        const value = this.item.stake.replace(/,/g, "");
        return amountFormat((this.item.selection.price.back * value - value).toFixed(3), true, 3);
    }
}
