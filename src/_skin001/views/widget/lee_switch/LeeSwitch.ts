import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class LeeSwitch extends AbstractView {
    LangUtil = LangUtil;
    @Prop({ default: false }) readonly mode!: boolean;
    @Prop({ default: false }) readonly value!: boolean;
    @Prop({ default: "#ffff" }) readonly color!: string;
    @Prop({ default: "s" }) readonly size!: string;
    @Prop({ default: "ON" }) readonly startText!: string;
    @Prop({ default: "OFF" }) readonly endText!: string;

    mounted() {
        this.updateSwitchState();
    }

    updateSwitchState() {
        if (this.value === false) {
            if (this.mode) {
                if (this.getItem("mode")) {
                    this.$emit("input", true);
                    this.setItem("mode", 1, 1);
                    document.documentElement.classList.add("dark");
                } else {
                    this.$emit("input", false);
                    this.removeItem("mode");
                    document.documentElement.classList.remove("dark");
                }
            }
        } else {
            if (this.mode) {
                if (!this.getItem("mode")) {
                    this.$emit("input", false);
                    this.removeItem("mode");
                    document.documentElement.classList.remove("dark");
                } else {
                    this.$emit("input", true);
                    this.setItem("mode", 1, 1);
                    document.documentElement.classList.add("dark");
                }
            }
        }
    }

    chuli() {
        if (this.value === false) {
            this.$emit("input", true);
            if (this.mode) {
                this.setItem("mode", 1, 1);
                document.documentElement.classList.add("dark");
            }
        } else {
            this.$emit("input", false);
            if (this.mode) {
                this.removeItem("mode");
                document.documentElement.classList.remove("dark");
            }
        }
    }

    setItem(key: string, data: any, time: number) {
        try {
            if (!localStorage) {
                return false;
            }
            const cacheExpireDate = new Date().getTime() + time * 60 * 60 * 24 * 1000;
            const cacheVal = { val: data, exp: cacheExpireDate };
            localStorage.setItem(key, JSON.stringify(cacheVal));
        } catch (e) {
            console.log(e);
        }
    }

    getItem(key: string) {
        try {
            if (!localStorage) {
                return false;
            }
            const cacheVal = localStorage.getItem(key);
            const result = JSON.parse(cacheVal!);
            const now = new Date().getTime();
            if (!result) {
                return null;
            }
            if (now > result.exp) {
                this.removeItem(key);
                return "";
            }
            return result.val;
        } catch (e) {
            this.removeItem(key);
            return null;
        }
    }

    removeItem(key: string) {
        if (!localStorage) {
            return false;
        }
        localStorage.removeItem(key);
    }
}
