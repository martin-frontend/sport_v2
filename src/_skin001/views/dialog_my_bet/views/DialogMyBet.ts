import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import DialogMyBetMediator from "../mediator/DialogMyBetMediator";
import DialogMyBetProxy from "../proxy/DialogMyBetProxy";
import LangUtil from "@/core/global/LangUtil";
import BetProxy from "@/proxy/BetProxy";
import GlobalVar from "@/core/global/GlobalVar";
import SelfProxy from "@/proxy/SelfProxy";
import { EnumPostMessage } from "@/enum/EnumPostMessage";

@Component
export default class DialogMyBet extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar
    selfProxy: SelfProxy = this.getProxy(SelfProxy);
    betProxy: BetProxy = this.getProxy(BetProxy);
    myProxy: DialogMyBetProxy = this.getProxy(DialogMyBetProxy);
    pageData = this.myProxy.pageData;

    isShowBet = true;

    constructor() {
        super(DialogMyBetMediator);
    }

    //检测是否为滚球
    checkInplay(index: number) {
        return !!this.betProxy.pageData.event_states[index] && !!this.betProxy.pageData.event_states[index].goals_ft;
    }

    @Watch("betProxy.pageData.activeCount")
    onWatchBet() {
        this.$nextTick(() => {
            this.pageData.bShow = this.betProxy.pageData.list.length > 0;
            console.warn("this.pageData.bShow: ", this.pageData.bShow);
        });
    }

    onTopup() {
        if (window.parent) {
            window.parent.postMessage(EnumPostMessage.TOPUP, "*");
        }
    }

    onClose() {
        this.pageData.bShow = false;
    }
}