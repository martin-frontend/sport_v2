import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { addClass, hasClass, logEnterTips, removeClass } from "@/core/global/Functions";
import getProxy from "@/core/global/getProxy";
import { TransMarketPrice } from "@/core/global/Functions";
import BetProxy from "@/proxy/BetProxy";
import GlobalVar from "@/core/global/GlobalVar";
import SelfProxy from "@/proxy/SelfProxy";
import DialogBetResultProxy from "@/_skin001/views/dialog_bet_result/proxy/DialogBetResultProxy";
import PageRacingDetailProxy from "../../proxy/PageRacingDetailProxy";

@Component
export default class BtnFixedBet extends AbstractView {
    LangUtil = LangUtil;
    TransMarketPrice = TransMarketPrice;
    myProxy: BetProxy = getProxy(BetProxy);
    pageData = this.myProxy.pageData;
    @Prop() match!: any;
    @Prop() matchKey!: any;
    @Prop() market!: any;
    @Prop() selection!: any;
    @Prop() price!: any;
    @Prop({ default: false }) isFav!: any;
    iconOdds = "arrow_up";
    cleartimer = 0;
    isChangeAni = false; //当前是否正在播放赔率变化动画
    selfProxy: SelfProxy = getProxy(SelfProxy);
    user_type!: number;
    betResultProxy: DialogBetResultProxy = getProxy(DialogBetResultProxy);
    isActive = false;

    mounted() {
        this.clearOddsStatus();
        this.onWatchActive();
        const { user_type } = this.selfProxy.userInfo;
        this.user_type = user_type;
    }

    @Watch("$vuetify.theme.dark")
    onWatchDark() {
        this.clearOddsStatus(0);
    }
    @Watch("isFav")
    onWatchIsFav() {
        if (this.isFav) {
            this.clearOddsStatus(0);
        }
    }

    //添加 涨迭样式
    @Watch("price")
    onWatchPrice(newVal: any, oldVal: any) {
        if (!oldVal || this.isFav) return;
        const divPrice: HTMLElement = <any>this.$refs.divPrice;
        const imgOdds: HTMLElement = <any>this.$refs.imgOdds;
        //@ts-ignore
        const divBox: HTMLElement = <any>this.$refs.divBox.$el;
        if (this.isActive) return;

        if (newVal > oldVal) {
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
        } else if (newVal < oldVal) {
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
    }

    @Watch("pageData.activeCount")
    onWatchActive() {
        //@ts-ignore
        const divBox: HTMLElement = <any>this.$refs.divBox?.$el;
        const divPrice: HTMLElement = <any>this.$refs.divPrice;
        if (divBox) {
            const item = this.pageData.list.find(
                (item) =>
                    item.selection &&
                    this.selection &&
                    item.selection.id == this.selection.id &&
                    item.market.market_id == this.market.market_id
            );
            this.isActive = !!item;

            if (divPrice) {
                if (!this.isChangeAni) {
                    if (this.isActive) {
                        divPrice.style.color = "#0F1213";
                        divBox.style.borderColor = "#FFCD43";
                    } else {
                        divPrice.style.color = this.$vuetify.theme.dark ? "#FFFFFF" : "#0F1213";
                        divBox.style.borderColor = this.$vuetify.theme.dark ? "#333435" : "#DCDCDC";
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
                imgOdds.style.opacity = "0";
                imgOdds.classList.remove("animation-translate");
                if (
                    !this.pageData.list.find(
                        (item) => item.selection.id == this.selection.id && item.market.market_id == this.market.market_id
                    )
                ) {
                    divPrice.style.color = this.$vuetify.theme.dark ? "#FFFFFF" : "#0F1213";
                    divBox.style.borderColor = this.$vuetify.theme.dark ? "#333435" : "#DCDCDC";
                }

                divPrice.style.color = this.$vuetify.theme.dark ? "#FFFFFF" : "#0F1213";
                this.isChangeAni = false;
                this.onWatchActive();
            }, delay);
        }
    }

    onBet() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
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
        const detailProxy: PageRacingDetailProxy = getProxy(PageRacingDetailProxy);
        let comp: any = detailProxy.pageData.competition_list.find(
            (item: any) => item.competition_id == detailProxy.pageData.competitionId
        );
        let event_states = detailProxy.pageData.event_states;

        if (this.selection.price.back == null) {
            this.selection.price.back = "SP";
        }

        this.myProxy.addItem(comp, { ...this.match, key: this.matchKey }, this.market, this.selection, event_states);
    }
}
