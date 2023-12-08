import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import Assets from "@/_skin001/assets/Assets";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";
import getProxy from "@/core/global/getProxy";
import page_home from "../../page_home";
import NavigationProxy from "../proxy/NavigationProxy";
import page_racing_home from "../../page_racing_home";
import SportUtil from "@/core/global/SportUtil";

@Component
export default class MarketTypeTag extends AbstractView {
    LangUtil = LangUtil;
    @Prop() item!: any;
    @Prop() sportId!: number;
    sportIcon = Assets.SportIcon;
    tagIcon = Assets.TagIcon;
    myProxy: NavigationProxy = getProxy(NavigationProxy);
    pageData = this.myProxy.pageData;
    homeProxy: PageHomeProxy = getProxy(PageHomeProxy);
    tagOption = {
        inplay: { vClass: "tagTextColor1--text" },
        today: { vClass: "tagTextColor2--text" },
        future: { vClass: "tagTextColor3--text" },
    };
    isShowAllComp = false;
    isRaceEvent = SportUtil.isRaceEvent;

    get curSportId() {
        return this.homeProxy.listQueryComp.sport_id;
    }

    get curTag() {
        return this.homeProxy.listQueryComp.tag;
    }

    get curSportNav() {
        return this.myProxy.pageData.new_menu_subnav[this.curSportId];
    }

    get loveCount() {
        let count = 0;
        for (const comp of this.pageData.lovematch) {
            count += comp.count;
        }
        return count;
    }

    onSportClick() {
        if (!SportUtil.isRaceEvent(this.sportId)) {
            page_home.showBySport(this.sportId);
        } else {
            this.homeProxy.listQueryComp.sport_id = this.sportId;
            page_racing_home.showBySport(this.sportId);
        }
    }

    onTagClick(key: string) {
        this.isShowAllComp = false;
        page_home.showByTag(key);
    }

    showAllComp() {
        this.isShowAllComp = !this.isShowAllComp;
    }

    onShowCompetition(comp_id: number) {
        page_home.showByCompetition(comp_id);
    }

    destroyed() {
        super.destroyed();
    }

    get isRaceSport() {
        return [7, 8].includes(Number(this.sportId));
    }
}
