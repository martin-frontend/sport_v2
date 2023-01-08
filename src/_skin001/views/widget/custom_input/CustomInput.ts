import AbstractView from "@/core/abstract/AbstractView";
import { amountFormat } from "@/core/global/Functions";
import { Prop, Watch, Component } from "vue-property-decorator";

@Component
export default class CustomInput extends AbstractView {
    @Prop() icon!: string;
    @Prop() placeholder!: string;
    @Prop({ default: "text" }) type!: string;
    @Prop({ default: 100 }) maxlength!: number;
    @Prop() disabled!: number;
    @Prop() readonly!: number;
    @Prop() height!: string;
    @Prop() isOnlyNumber!: boolean;
    @Prop({ default: true }) showClear!: boolean;
    @Prop({ default: 8 }) radius!: number;
    @Prop({ default: "left" }) textDirection!: string;
    @Prop({ default: false }) formatNumber!: boolean;

    inputValue: any = "";
    amountFormat = amountFormat;

    @Prop() value!: any;
    @Watch("value", { immediate: true })
    onValueChange(val: string) {
        if (this.isOnlyNumber && val) {
            // console.warn(val);
            this.inputValue = this.formatNumber ? amountFormat(val.replace(/[^\d]/g, "")) : val.replace(/[^\d]/g, "");
            return;
        }
        this.inputValue = val;
    }

    onInput(event: any) {
        if (this.isOnlyNumber) {
            if (this.formatNumber) {
                this.inputValue = amountFormat(event.target.value.replace(/[^\d]/g, "").substring(0, this.maxlength - 1));
            } else {
                this.inputValue = event.target.value.replace(/[^\d]/g, "");
            }

            this.$emit("input", this.inputValue.replace(/,/g, ""));
            return;
        }
        this.$emit("input", this.inputValue);
    }

    onClear() {
        this.inputValue = this.isOnlyNumber ? 0 : "";
        this.$emit("input", this.inputValue);
    }
}
