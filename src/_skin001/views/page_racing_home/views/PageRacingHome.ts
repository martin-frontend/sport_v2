import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageRacingHomeMediator from "../mediator/PageRacingHomeMediator";
import PageRacingHomeProxy from "../proxy/PageRacingHomeProxy";
import LangUtil from "@/core/global/LangUtil";
import NavigationProxy from "../../navigation/proxy/NavigationProxy";
import SportUtil from "@/core/global/SportUtil";
import page_racing_home from "..";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";
import page_live_list from "../../page_live_list";

@Component
export default class PageRacingHome extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageRacingHomeProxy = this.getProxy(PageRacingHomeProxy);
    homeProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    pageData = this.myProxy.pageData;
    isRaceEvent = SportUtil.isRaceEvent;
    listQueryComp = this.myProxy.listQueryComp;

    constructor() {
        super(PageRacingHomeMediator);
    }

    get curSportId() {
        return this.homeProxy.listQueryComp.sport_id;
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
            dayAfterTomorrow: { title: this.curSportNav?.dayAfterTomorrow?.name, tag: "dayAfterTomorrow" },
        };
    }

    get nextTableData() {
        if (this.curTag != this.tagOptions.withinAnHour.tag) return [];
        const arr = <any>[];
        this.pageData.competition_list.forEach((item: any) => {
            if (!this.$vuetify.breakpoint.mobile) {
                if (!this.sportCheckBoxArr.includes(`${item.sport_id}`)) return;
            } else {
                if (item.sport_id != this.listQueryComp.sport_id) return;
            }

            Object.keys(item.matches).forEach((key) => {
                const match = item.matches[key];
                arr.push({ ...item, r: key, match });
            });
        });
        arr.sort(function (a: any, b: any) {
            return a.match.start_time_timestamp - b.match.start_time_timestamp;
        });
        return arr;
    }

    onTagClick(tag: any) {
        this.myProxy.listQueryComp.tag = tag;
        page_racing_home.showBySport(this.sportCheckBoxArr.toString(), tag);
    }

    get raceSportArr() {
        return this.navProxy.pageData.sportIdArr.filter((id) => this.isRaceEvent(id));
    }

    @Watch("homeProxy.listQueryComp.sport_id")
    onWatchSportId(newVal: any) {
        this.sportCheckBoxArr = [`${newVal}`];
    }

    sportCheckBoxArr = [`${this.homeProxy.listQueryComp.sport_id}`];

    sportCheckBoxOptions = {
        7: { title: "赛马", sportId: "7", icon: "race" },
        8: { title: "赛狗", sportId: "8", icon: "greyhound_racing" },
        9: { title: "马车赛", sportId: "9", icon: "harness_racing" },
    };

    // onBack() {
    //     this.$router.back();
    // }

    oldArrLength = 0;
    onCheckboxChange(val: any) {
        if (this.oldArrLength < val.length) {
            const lastVal = val[val.length - 1];
            page_racing_home.showBySport(lastVal);
        }
        this.oldArrLength = val.length;
    }

    getTableData(sportId: number) {
        return this.pageData.competition_list.filter((item: any) => item.sport_id == sportId);
    }

    //搜寻
    onSearch() {
        page_racing_home.showByKeyword(this.listQueryComp.keyword);
    }

    // 打开热门直播页
    goLiveList() {
        page_live_list.show();
    }

    destroyed() {
        super.destroyed();
    }
}
