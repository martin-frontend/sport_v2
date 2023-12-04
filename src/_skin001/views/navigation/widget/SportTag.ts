import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import Assets from "@/_skin001/assets/Assets";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";
import getProxy from "@/core/global/getProxy";

@Component
export default class MarketTypeTag extends AbstractView {
    LangUtil = LangUtil;
    @Prop() item!: any;
    @Prop() sportId!: any;
    sportIcon = Assets.SportIcon;
    homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    childTagOption = {
        inplay: { icon: "live", vClass: "tagTextColor1--text" },
        today: { icon: "today", vClass: "tagTextColor2--text" },
        future: { icon: "early", vClass: "tagTextColor3--text" },
    };
    childTag = "";

    onSportTagClick() {
        this.homeProxy.listQueryComp.sport_id = this.sportId;
    }

    onTypeClick(key: string) {
        this.childTag = key;
    }

    destroyed() {
        super.destroyed();
    }
}
