import PageOrderUnsettled from "../views/PageOrderUnsettled";
import { Prop } from "vue-property-decorator";

export default class ParlayOrder extends PageOrderUnsettled {
    @Prop() item!: any;

    isShowCompetition = false;

    // get parlayOdds() {
    //     let odds = 1;
    //     this.item.leg_info.forEach((item: any) => {
    //         odds *= this.TransMarketPrice(item.odds);
    //     });
    //     return odds.toFixed(2);
    // }
}
