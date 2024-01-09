import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import RacingPanelMediator from "../mediator/RacingPanelMediator";
import RacingPanelProxy from "../proxy/RacingPanelProxy";
import LangUtil from "@/core/global/LangUtil";
import NavigationProxy from "../../navigation/proxy/NavigationProxy";
import SportUtil from "@/core/global/SportUtil";
import racing_panel from "..";
import page_racing_detail from "../../page_racing_detail";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";
import Assets from "@/_skin001/assets/Assets";

@Component
export default class RacingPanel extends AbstractView {
    LangUtil = LangUtil;
    myProxy: RacingPanelProxy = this.getProxy(RacingPanelProxy);
    homeProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;
    sportCheckBoxArr: any = [this.homeProxy.listQueryComp.sport_id.toString()];
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    isRaceEvent = SportUtil.isRaceEvent;
    timer = 0;
    sportIcon = Assets.SportIcon;

    created() {
        racing_panel.init(this.homeProxy.listQueryComp.sport_id);
    }

    mounted() {
        if (!this.$vuetify.breakpoint.mobile) {
            this.timer = setInterval(this.resizeListHeight.bind(this), 1000);
        }
    }

    sportCheckBoxOptions = {
        7: { title: "赛马", sportId: "7" },
        8: { title: "赛狗", sportId: "8" },
        9: { title: "马车赛", sportId: "9" },
    };

    get raceSportArr() {
        return this.navProxy.pageData.sportIdArr.filter((id) => this.isRaceEvent(id));
    }

    get tagOptions() {
        // return ["下一场", "热门联赛"];
        return ["下一场"];
    }

    oldArrLength = 0;
    onCheckboxChange(val: any) {
        if (this.oldArrLength < val.length) {
            const lastVal = val[val.length - 1];
            racing_panel.init(lastVal);
        }
        this.oldArrLength = val.length;
    }

    onTagClick(index: number) {
        this.pageData.tag = index;
        // this.sportCheckBoxArr = [this.homeProxy.listQueryComp.sport_id.toString()];
        // racing_panel.init(this.homeProxy.listQueryComp.sport_id);
    }

    get nextTableData() {
        if (this.pageData.tag != 0) return [];
        const arr = <any>[];
        this.pageData.competition_list.forEach((item: any) => {
            if (!this.sportCheckBoxArr.includes(`${item.sport_id}`)) return;

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

    getResultStr(match_phase: string) {
        const type: any = {
            OPEN: "",
            DONE: "",
            INTERIM: "临时",
            ABANDONED: "放弃",
            FINAL: "最后",
            CLOSED: "关闭",
        };
        return LangUtil(type[match_phase]);
    }

    onShowDetail(item: any, matchKey: any) {
        console.warn("---->>>收到点击---", item);
        page_racing_detail.show({
            competitionId: item.competition_id,
            listQueryComp: { ...this.myProxy.listQueryComp, sport_id: item.sport_id },
            matchKey: matchKey,
            event_id: item.matches[matchKey].id,
        },item.matches[matchKey].id);
    }

    getRanking(event_id: number) {
        const placings = this.getStates(event_id)?.results?.placings;
        let str = "";
        if (placings) {
            // 将物件转换为键值对的阵列
            const keyValueArray = Object.entries(placings);

            // 根据值的大小升幂排序阵列
            keyValueArray.sort((a: any, b: any) => a[1] - b[1]);

            const arr: any = [];
            keyValueArray.forEach((item: any, index) => {
                if (item[1] < 4) {
                    // 名次与前一个相同的加-
                    if (index != 0 && item[1] == keyValueArray[index - 1][1]) {
                        const pre = arr.pop();
                        arr.push(pre + "-" + item[0]);
                    } else {
                        arr.push(item[0]);
                    }
                }
            });
            str = arr.toString();
        }
        return str;
    }

    isShowP(event_id: number) {
        return this.getFixMarket(event_id)?.RB_WIN?.selections.findIndex((item: any) => item.metadata?.fluctuate?.length > 0) > -1;
    }

    /**盘口 固陪*/
    getFixMarket(event_id: number) {
        return this.pageData.marketListByEventId[event_id]?.fix_markets;
    }

    /**进程 */
    getStates(event_id: number) {
        return this.pageData.eventStatesByEventId[event_id];
    }

    resizeListHeight() {
        const divlist = this.$refs.divlist;
        if (divlist) {
            //@ts-ignore
            const el: HTMLElement = divlist;
            if (el) el.style.height = document.body.clientHeight - el.getBoundingClientRect().top + "px";
        }
    }

    constructor() {
        super(RacingPanelMediator);
    }

    destroyed() {
        clearInterval(this.timer);
        super.destroyed();
    }
}
