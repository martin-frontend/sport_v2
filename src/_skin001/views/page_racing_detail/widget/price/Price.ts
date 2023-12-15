import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { TransMarketPrice } from "@/core/global/Functions";

@Component
export default class Price extends AbstractView {
    LangUtil = LangUtil;
    TransMarketPrice = TransMarketPrice;
    GlobalVar = GlobalVar;
    @Prop() price!: any;
    @Prop() oldPrice!: any;
    @Prop({ default: true }) animation!: any;
    iconOdds = "";
    cleartimer = 0;
    isChangeAni = false; //当前是否正在播放赔率变化动画

    @Watch("price")
    onWatchOdds(newVal: any, oldVal: any) {
        if (!oldVal) return;
        if (!this.animation) return;
        const divPrice: HTMLElement = <any>this.$refs.divPrice;
        const imgOdds: HTMLElement = <any>this.$refs.imgOdds;
        if (divPrice && imgOdds) {
            if (newVal > oldVal) {
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
            this.isChangeAni = true;
            this.clearOddsStatus();
        }
    }
    clearOddsStatus() {
        clearTimeout(this.cleartimer);
        const imgOdds: HTMLElement = <any>this.$refs.imgOdds;
        const divPrice: HTMLElement = <any>this.$refs.divPrice;
        if (imgOdds && divPrice) {
            this.cleartimer = setTimeout(() => {
                this.isChangeAni = false;
                imgOdds.style.opacity = "0";
                imgOdds.classList.remove("animation-translate");
                // divPrice.style.color = this.$vuetify.theme.dark ? "#8E8F91" : "#8E8F91";
                divPrice.style.color = this.$vuetify.theme.dark ? "#FFFFFF" : "#0F1213";
            }, 5000);
        }
    }

    destroyed() {
        super.destroyed();
    }
}
