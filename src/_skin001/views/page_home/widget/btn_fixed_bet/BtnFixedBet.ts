import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { FixSelectionVO, MarketFixVO } from "@/vo/MarketVO";
import { addClass, hasClass, removeClass } from "@/core/global/Functions";
import { MatchVO } from "@/vo/MatchVO";
import my_bet from "@/_skin001/views/my_bet";
import getProxy from "@/core/global/getProxy";
import { TransMarketPrice } from "@/core/global/Functions";
import PageHomeProxy from "../../proxy/PageHomeProxy";
import BetProxy from "@/proxy/BetProxy";
import MatcheProxy from "@/_skin001/views/matche/proxy/MatcheProxy";
import LiveProxy from "@/_skin001/views/live/proxy/LiveProxy";
import DialogBetResultProxy from "@/_skin001/views/dialog_bet_result/proxy/DialogBetResultProxy";
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

    oldData!: any; //保存数据'
    iconOdds = "arrow_up";
    cleartimer = 0;
    isChangeAni = false; //当前是否正在播放赔率变化动画

    mounted() {
        this.watchSelection();
        this.clearOddsStatus();
        this.onWatchActive();
    }

    @Watch("$vuetify.theme.dark")
    onWatchDark() {
        this.clearOddsStatus(0);
    }

    //添加 涨迭样式
    @Watch("selection")
    watchSelection() {
        if (this.market && this.market.status != 2 && this.selection.type && this.selection.status == 0 && this.selection.price.back) {
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
                    if (divPrice) divPrice.style.color = "#F64D55";
                    if (imgOdds) {
                        imgOdds.style.opacity = "1";
                        imgOdds.style.color = "#F64D55";
                        imgOdds.classList.add("animation-translate");
                    }
                    if (divBox) divBox.style.borderColor = "#F64D55";
                } else if (cha < 0) {
                    this.isChangeAni = true;
                    this.clearOddsStatus();
                    this.iconOdds = "arrow_down";
                    if (divPrice) divPrice.style.color = "#41A81D";
                    if (imgOdds) {
                        imgOdds.style.opacity = "1";
                        imgOdds.style.color = "#41A81D";
                        imgOdds.classList.add("animation-translate");
                    }
                    if (divBox) divBox.style.borderColor = "#41A81D";
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
            this.pageData.list.find((item) => item.selection.id == this.selection.id && item.market.market_id == this.market.market_id)
                ? addClass(divBox, "active")
                : removeClass(divBox, "active");
            if (divPrice) {
                if (!this.isChangeAni) {
                    if (hasClass(divBox, "active")) {
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
                // this.onWatchActive();
                imgOdds.style.opacity = "0";
                imgOdds.classList.remove("animation-translate");
                if (
                    !this.pageData.list.find(
                        (item) => item.selection.id == this.selection.id && item.market.market_id == this.market.market_id
                    )
                ) {
                    if (divPrice) divPrice.style.color = this.$vuetify.theme.dark ? "#FFFFFF" : "#0F1213";
                    if (divBox) divBox.style.borderColor = this.$vuetify.theme.dark ? "#333435" : "#DCDCDC";
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
        if (this.market && this.market.status != 2 && this.selection && this.selection.status == 0) {
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

            const betResultProxy:DialogBetResultProxy = getProxy(DialogBetResultProxy);
            betResultProxy.pageData.market = JSON.parse(JSON.stringify(this.market));
            betResultProxy.pageData.matche = JSON.parse(JSON.stringify(this.matche));
            betResultProxy.pageData.selection = JSON.parse(JSON.stringify(this.selection));
        }
    }
}
