import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageRacingHomeMediator from "../mediator/PageRacingHomeMediator";
import PageRacingHomeProxy from "../proxy/PageRacingHomeProxy";
import LangUtil from "@/core/global/LangUtil";
import NavigationProxy from "../../navigation/proxy/NavigationProxy";
import SportUtil from "@/core/global/SportUtil";
import page_racing_home from "..";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";

@Component
export default class PageRacingHome extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageRacingHomeProxy = this.getProxy(PageRacingHomeProxy);
    homeProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    pageData = this.myProxy.pageData;
    isRaceEvent = SportUtil.isRaceEvent;

    tag = "today";

    get curSportId() {
        return this.myProxy.listQueryComp.sport_id;
    }

    get curTag() {
        return this.myProxy.listQueryComp.tag;
    }

    get curSportNav() {
        return this.navProxy.pageData.new_menu_subnav[this.curSportId];
    }

    get tagOptions() {
        return {
            withinAnHour: { title: "下一场", tag: "withinAnHour" },
            today: { title: "今天", tag: "today" },
            tomorrow: { title: "明天", tag: "tomorrow" },
            dayAfterTomorrow: { title: this.curSportNav?.dayAfterTomorrow.name, tag: "dayAfterTomorrow" },
        };
    }

    onTagClick(key: any) {
        this.tag = key;
        page_racing_home.showByTag(key);
    }

    get raceSportArr() {
        return this.navProxy.pageData.sportIdArr.filter((id) => this.isRaceEvent(id));
    }

    @Watch("homeProxy.listQueryComp.sport_id")
    onWatchSportId(newVal: any) {
        this.checkBoxArr = [newVal];
    }

    checkBoxArr = [this.homeProxy.listQueryComp.sport_id];

    checkBoxOptions = {
        7: { title: "赛马", sportId: 7, icon: "race" },
        8: { title: "赛狗", sportId: 8, icon: "greyhound_racing" },
        // c: { title: "马车赛", sportId: "c", icon: "harness_racing" },
    };

    // onBack() {
    //     this.$router.back();
    // }

    onCheckboxChange(val: any) {
        if (val.length > 0) {
            const lastVal = val[val.length - 1];
            page_racing_home.showBySport(lastVal);
        }
    }

    constructor() {
        super(PageRacingHomeMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
