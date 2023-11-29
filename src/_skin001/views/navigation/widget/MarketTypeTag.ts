import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class MarketTypeTag extends AbstractView {
    LangUtil = LangUtil;
    @Prop() item!: any;

    isShowChildTag = false;
    childTagOption = [
        { title: "滚球", icon: "live", key: "live", vClass: "tagTextColor1--text", count: "1" },
        { title: "今日", icon: "today", key: "today", vClass: "tagTextColor2--text", count: "1" },
        { title: "早盘", icon: "early", key: "early", vClass: "tagTextColor3--text", count: "1" },
    ];
    childTag = "";

    onTagClick(key: string) {
        this.childTag = key;
    }

    destroyed() {
        super.destroyed();
    }
}
