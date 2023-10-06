import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class SmallDecimal extends AbstractView {
    LangUtil = LangUtil;
    @Prop() amount!: string;

    get amountArr() {
        const amount = this.amount?.toString() || "0.00";
        return amount.split(".");
    }
}
