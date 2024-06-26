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
import Assets from "@/_skin001/assets/Assets";
import { dateFormat } from "@/core/global/Functions";

@Component
export default class PageRacingHome extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageRacingHomeProxy = this.getProxy(PageRacingHomeProxy);
    homeProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    pageData = this.myProxy.pageData;
    isRaceEvent = SportUtil.isRaceEvent;
    listQueryComp = this.myProxy.listQueryComp;
    sportIcon = Assets.SportIcon;

    constructor() {
        super(PageRacingHomeMediator);
    }

    mounted() {
        if (!this.isRaceEvent(this.homeProxy.listQueryComp.sport_id)) {
            this.$router.push("/page_home");
            return;
        }
        this.myProxy.sportCheckBoxArr = [`${this.homeProxy.listQueryComp.sport_id}`];
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
            dayAfterTomorrow: { title: this.getDayAfterTomorrow(this.curSportNav?.dayAfterTomorrow?.name), tag: "dayAfterTomorrow" },
        };
    }

    getDayAfterTomorrow(dayAfterTomorrow: any) {
        if (!dayAfterTomorrow) return "";
        return dateFormat(new Date(dayAfterTomorrow), "yyyy/MM/dd", true);
    }
    /**进程 */
    getStates(event_id: number) {
        return this.pageData.eventStatesByEventId[event_id];
    }

    get nextTableData() {
        if (this.curTag != this.tagOptions.withinAnHour.tag) return [];
        const arr = <any>[];
        this.pageData.competition_list.forEach((item: any) => {
            if (!this.$vuetify.breakpoint.mobile) {
                if (!this.myProxy.sportCheckBoxArr.includes(`${item.sport_id}`)) return;
            } else {
                if (item.sport_id != this.listQueryComp.sport_id) return;
            }

            Object.keys(item.matches).forEach((key) => {
                const match = item.matches[key];
                if (this.getStates(match.id)?.match_phase != "OPEN") return;
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
        page_racing_home.showBySport(this.myProxy.sportCheckBoxArr.toString(), tag);
    }

    get raceSportArr() {
        return this.navProxy.pageData.sportIdArr.filter((id) => this.isRaceEvent(id));
    }

    @Watch("homeProxy.listQueryComp.sport_id")
    onWatchSportId(newVal: any) {
        this.myProxy.sportCheckBoxArr = [`${newVal}`];
        this.listQueryComp.keyword = "";
    }

    sportCheckBoxOptions = {
        7: { title: "赛马", sportId: "7" },
        8: { title: "赛狗", sportId: "8" },
        9: { title: "马车赛", sportId: "9" },
    };

    // onBack() {
    //     this.$router.back();
    // }

    oldArrLength = 0;
    onCheckboxChange(val: any) {
        if (this.oldArrLength < val.length) {
            const lastVal = val[val.length - 1];
            page_racing_home.showBySport(lastVal, this.curTag);
        }
        this.oldArrLength = val.length;
    }

    getTableData(sportId: number) {
        const item = this.pageData.competition_list.filter((item: any) => item.sport_id == sportId);
        // console.warn("--item----", item);
        return item;
    }

    //搜寻
    onSearch() {
        page_racing_home.showByKeyword(this.listQueryComp.keyword);
    }

    // 打开热门直播页
    goLiveList() {
        page_live_list.show();
    }

    onFilter() {
        this.myProxy.pageData.isShowFilter = !this.myProxy.pageData.isShowFilter;
    }

    destroyed() {
        super.destroyed();
    }
}
