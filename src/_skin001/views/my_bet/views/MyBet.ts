import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import MyBetMediator from "../mediator/MyBetMediator";
import LangUtil from "@/core/global/LangUtil";
import BetProxy from "@/proxy/BetProxy";
import { amountFormat, dateFormat, formatEventTime, getDateByTimeZone, TransMarketPrice } from "@/core/global/Functions";
import MarketUtils from "@/core/global/MarketUtils";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import GlobalVar from "@/core/global/GlobalVar";
import SettingProxy from "@/proxy/SettingProxy";
import getProxy from "@/core/global/getProxy";
import SelfProxy from "@/proxy/SelfProxy";
import Vue from "vue";

@Component
export default class MyBet extends AbstractView {
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

    constructor() {
        super(MyBetMediator);
    }

    getStates(event_id: number) {
        return this.pageData.event_states.find((item1) => item1.event_id == event_id);
    }

    getStartTime(matche: any) {
        return formatEventTime(dateFormat(getDateByTimeZone(matche.sb_time * 1000, <any>GlobalVar.zone), "yyyy-MM-dd hh:mm:ss"));
    }

    getDay(time: number): number {
        return Math.floor(time / 60 / 60 / 24);
    }
    getHour(time: number): number {
        return Math.floor(time / 60 / 60);
    }
    getMinute(time: number): number {
        return Math.floor((time / 60) % 60);
    }

    //赛事进程
    getStats(index: number) {
        if (this.pageData.event_states.length > 0) {
            const item = this.pageData.list[index];
            const market_type = item.market.market_type;
            const state = this.pageData.event_states.find((item1) => item1.event_id == item.matche.id);
            console.warn("j>>>>>>>>>", state);
            console.warn(market_type);
            return `${OrderTitleUtils.getScoreStr({ market_type: market_type, state: state })}`;
        }
    }
    //检测是否为滚球
    checkInplay(index: number) {
        return !!this.pageData.event_states[index] && !!this.pageData.event_states[index].goals_ft;
    }
    //快捷输入
    onInputFast(stake: any, fastChoose: any) {
        return ((stake ? parseInt(stake) : 0) + parseInt(fastChoose)).toString();
    }
    //删除注单
    onDelete(item: any) {
        this.myProxy.deleteItem(item.market.market_id, item.selection.id);
    }
    /**投注 */
    onBet(item: any) {
        const { gold } = this.selfProxy.userInfo;
        const { selection, market } = item;
        if (parseFloat(item.stake) < <any>item.minStake || parseFloat(item.stake) > <any>item.maxStake) {
            Vue.notify({
                group: "message",
                title: LangUtil("请确认投注限额"),
            });
        } else if (parseFloat(item.stake) > parseFloat(gold)) {
            Vue.notify({
                group: "message",
                title: LangUtil("余额不足"),
            });
        } else if (!item.stake) {
            Vue.notify({
                group: "message",
                title: LangUtil("确认投注额"),
            });
        } else {
            this.myProxy.api_user_betfix(market.market_id, selection.id);
        }
    }

    onMax(item: any) {
        item.stake = Math.min(parseFloat(this.selfProxy.userInfo.gold) >> 0, item.maxStake).toString();
    }

    destroyed() {
        super.destroyed();
    }
}
