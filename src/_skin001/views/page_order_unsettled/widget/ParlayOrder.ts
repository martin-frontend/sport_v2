import PageOrderUnsettled from "../views/PageOrderUnsettled";
import { Prop } from "vue-property-decorator";

export default class ParlayOrder extends PageOrderUnsettled {
    @Prop() item!: any;

    isShowCompetition = false;
}
