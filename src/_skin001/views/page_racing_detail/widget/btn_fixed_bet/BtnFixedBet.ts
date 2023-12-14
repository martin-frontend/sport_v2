import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { FixSelectionVO, MarketFixVO } from "@/vo/MarketVO";
import { addClass, hasClass, logEnterTips, removeClass } from "@/core/global/Functions";
import { MatchVO } from "@/vo/MatchVO";
import my_bet from "@/_skin001/views/my_bet";
import getProxy from "@/core/global/getProxy";
import { TransMarketPrice } from "@/core/global/Functions";
import BetProxy from "@/proxy/BetProxy";
import MatcheProxy from "@/_skin001/views/matche/proxy/MatcheProxy";
import LiveProxy from "@/_skin001/views/live/proxy/LiveProxy";
import DialogBetResultProxy from "@/_skin001/views/dialog_bet_result/proxy/DialogBetResultProxy";
import GlobalVar from "@/core/global/GlobalVar";
import SelfProxy from "@/proxy/SelfProxy";
import PageHomeProxy from "@/_skin001/views/page_home/proxy/PageHomeProxy";
@Component
export default class BtnFixedBet extends AbstractView {
    LangUtil = LangUtil;
    TransMarketPrice = TransMarketPrice;
    myProxy: BetProxy = getProxy(BetProxy);
    pageData = this.myProxy.pageData;
    @Prop() matche!: MatchVO;
    @Prop() market!: MarketFixVO;
    @Prop() selection!: FixSelectionVO;
    @Prop({ default: 12 }) cols!: number;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    user_type!: number;
    oldData!: any; //保存数据'
    iconOdds = "arrow_up";
    cleartimer = 0;
    isChangeAni = false; //当前是否正在播放赔率变化动画
    betResultProxy: DialogBetResultProxy = getProxy(DialogBetResultProxy);
    isLive = this.myProxy.pageData.isLive;

    mounted() {
        this.watchSelection();
        this.clearOddsStatus();
        this.onWatchActive();
        const { user_type } = this.selfProxy.userInfo;
        this.user_type = user_type;
    }

    @Watch("$vuetify.theme.dark")
    onWatchDark() {
        this.clearOddsStatus(0);
    }

    //添加 涨迭样式
    @Watch("selection")
    watchSelection() {
        if (
            this.market &&
            this.market.status != 2 &&
            this.selection &&
            this.selection.type &&
            this.selection.status == 0 &&
            this.selection.price.back
        ) {
            const divPrice: HTMLElement = <any>this.$refs.divPrice;
            const imgOdds: HTMLElement = <any>this.$refs.imgOdds;
            //@ts-ignore
            const divBox: HTMLElement = <any>this.$refs.divBox.$el;
            if (this.oldData) {
                //@ts-ignore
                const cha = this.selection.price.back - this.oldData.price.back;
                if (cha > 0) {
                    this.isChangeAni = true;
                    this.clearOddsStatus();
                    this.iconOdds = "arrow_up";
                    if (divPrice) divPrice.style.color = GlobalVar.color_up;
                    if (imgOdds) {
                        imgOdds.style.opacity = "1";
                        imgOdds.style.color = GlobalVar.color_up;
                        imgOdds.classList.add("animation-translate");
                    }
                    if (divBox) divBox.style.borderColor = GlobalVar.color_up;
                } else if (cha < 0) {
                    this.isChangeAni = true;
                    this.clearOddsStatus();
                    this.iconOdds = "arrow_down";
                    if (divPrice) divPrice.style.color = GlobalVar.color_down;
                    if (imgOdds) {
                        imgOdds.style.opacity = "1";
                        imgOdds.style.color = GlobalVar.color_down;
                        imgOdds.classList.add("animation-translate");
                    }
                    if (divBox) divBox.style.borderColor = GlobalVar.color_down;
                }
                this.oldData = JSON.parse(JSON.stringify(this.selection));
            } else {
                this.oldData = JSON.parse(JSON.stringify(this.selection));
            }
        }
    }

    @Watch("pageData.activeCount")
    onWatchActive() {
        //@ts-ignore
        const divBox: HTMLElement = <any>this.$refs.divBox?.$el;
        const divPrice: HTMLElement = <any>this.$refs.divPrice;
        if (divBox) {
            this.pageData.list.find(
                (item) =>
                    item.selection &&
                    this.selection &&
                    item.selection.id == this.selection.id &&
                    item.market.market_id == this.market.market_id
            )
                ? addClass(divBox, "active")
                : removeClass(divBox, "active");
            if (divPrice) {
                if (!this.isChangeAni) {
                    if (hasClass(divBox, "active")) {
                        divPrice.style.color = "#0F1213";
                        divBox.style.borderColor = "#FFCD43";
                    } else {
                        if (this.isLive) {
                            divPrice.style.color = "#FFFFFF";
                            divBox.style.borderColor = "transparent";
                        } else {
                            divPrice.style.color = this.$vuetify.theme.dark ? "#FFFFFF" : "#0F1213";
                            divBox.style.borderColor = this.$vuetify.theme.dark ? "#333435" : "#DCDCDC";
                        }
                    }
                }
            }
        }
    }

    clearOddsStatus(delay: number = 5000) {
        clearTimeout(this.cleartimer);
        const imgOdds: HTMLElement = <any>this.$refs.imgOdds;
        const divPrice: HTMLElement = <any>this.$refs.divPrice;
        //@ts-ignore
        const divBox: HTMLElement = <any>this.$refs.divBox.$el;
        if (imgOdds) {
            this.cleartimer = setTimeout(() => {
                // this.onWatchActive();
                imgOdds.style.opacity = "0";
                imgOdds.classList.remove("animation-translate");
                if (
                    !this.pageData.list.find(
                        (item) => item.selection.id == this.selection.id && item.market.market_id == this.market.market_id
                    )
                ) {
                    if (this.isLive) {
                        divPrice.style.color = "#FFFFFF";
                        divBox.style.borderColor = "transparent";
                    } else {
                        divPrice.style.color = this.$vuetify.theme.dark ? "#FFFFFF" : "#0F1213";
                        divBox.style.borderColor = this.$vuetify.theme.dark ? "#333435" : "#DCDCDC";
                    }
                }
                this.isChangeAni = false;
                this.onWatchActive();
            }, delay);
        }
    }

    getPrice() {
        if (this.selection && this.selection.price && this.selection.price.back) {
            return this.selection.price.back;
        }
        return "--";
    }

    onBet() {
        // if (this.user_type == 2) {
        //     logEnterTips();
        //     return;
        // }
        if (this.market && this.market.status != 2 && this.selection && this.selection.status == 0) {
            // 投注完后等待api回传结果时，如继续下注，需清空注单，并且不跳转确认订单页
            if (this.pageData.loading && !this.pageData.isContinueBetting) {
                this.pageData.isContinueBetting = true;
                this.myProxy.initBetList();
            }

            // 当前是在订单确认页时，添加下注需清空注单
            if (this.betResultProxy.pageData.bShow) {
                this.betResultProxy.pageData.bShow = false;
                this.myProxy.initBetList();
            }

            const homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
            let comp: any = homeProxy.pageData.competition_list.find((item) => item.competition_id == this.matche.competition_id);
            let event_states = homeProxy.pageData.event_states;
            if (!comp) {
                const matcheProxy: MatcheProxy = getProxy(MatcheProxy);
                comp = matcheProxy.pageData.competition_list[0];

                const liveProxy: LiveProxy = getProxy(LiveProxy);
                event_states = liveProxy.pageData.event_states;
            }
            this.myProxy.addItem(comp, this.matche, this.market, this.selection, event_states);

            // const betResultProxy: DialogBetResultProxy = getProxy(DialogBetResultProxy);
            // betResultProxy.pageData.market = JSON.parse(JSON.stringify(this.market));
            // betResultProxy.pageData.matche = JSON.parse(JSON.stringify(this.matche));
            // betResultProxy.pageData.selection = JSON.parse(JSON.stringify(this.selection));
        }
    }
}
