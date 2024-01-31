import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import page_racing_detail from "../../../page_racing_detail";
import { dateFormat, getDateByTimeZone } from "@/core/global/Functions";
import PageRacingHomeProxy from "../../proxy/PageRacingHomeProxy";
import GlobalVar from "@/core/global/GlobalVar";
import Assets from "@/_skin001/assets/Assets";
@Component
export default class MobileRaceTable extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageRacingHomeProxy = this.getProxy(PageRacingHomeProxy);
    pageData = this.myProxy.pageData;
    isShowContent = false;
    @Prop() data!: any;
    @Prop() tableData!: any;
    @Prop() sportItem!: any;
    @Prop({ default: false }) isNext!: boolean;
    sportIcon = Assets.SportIcon;
    headerList = ["R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10", "R11", "R12", "R13", "R14"];

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

    dateFormat() {}

    getEventDate(date: any) {
        return dateFormat(new Date(date), "MM/dd", true);
    }

    onShowDetail(item: any, matchKey: any) {
        if (!item.matches[matchKey] || item.matches[matchKey]?.is_open == 2) return;
        console.warn("--->>点击详情---", item);
        console.warn("--->>点击详情-matchKey--", matchKey);
        console.warn("--->>点击详情-matchKey--123", item.matches[matchKey].id);
        page_racing_detail.show(
            {
                competitionId: item.competition_id,
                listQueryComp: { ...this.myProxy.listQueryComp, sport_id: item.sport_id },
                matchKey: matchKey,
                event_id: item.matches[matchKey].id, 
            }
        );
    }

    getStartTime(start_time_timestamp: any) {
        return dateFormat(getDateByTimeZone(start_time_timestamp * 1000, <any>GlobalVar.zone), "hh:mm");
    }

    /**盘口 固陪*/
    getFixMarket(event_id: number) {
        return this.pageData.marketListByEventId[event_id]?.fix_markets;
    }
    /**进程 */
    getStates(event_id: number) {
        return this.pageData.eventStatesByEventId[event_id];
    }

    getRanking(event_id: number) {
        // const placings = this.getStates(event_id)?.results?.placings;
        // let str = "";
        return this.getRankingArr(event_id).toString();
        // if (placings) {
        //     // 将物件转换为键值对的阵列
        //     const keyValueArray = Object.entries(placings);

        //     // 根据值的大小升幂排序阵列
        //     keyValueArray.sort((a: any, b: any) => a[1] - b[1]);

        //     const arr: any = [];
        //     keyValueArray.forEach((item: any, index) => {
        //         if (item[1] < 4) {
        //             // 名次与前一个相同的加-
        //             if (index != 0 && item[1] == keyValueArray[index - 1][1]) {
        //                 const pre = arr.pop();
        //                 arr.push(pre + "-" + item[0]);
        //             } else {
        //                 arr.push(item[0]);
        //             }
        //         }
        //     });
        //     str = arr.toString();
        // }
        // return str;
    }

    getRankingArr(event_id: number) {
        const placings = this.getStates(event_id)?.results?.placings;

        if (placings) {
            // 将物件转换为键值对的阵列
            const keyValueArray = Object.entries(placings);

            // 根据值的大小升幂排序阵列
            keyValueArray.sort((a: any, b: any) => a[1] - b[1]);

            const arr: any = [];
            // 只取前三名
            let rank = [1, 2, 3];
            rank.forEach((r) => {
                const filter = keyValueArray.filter((item) => item[1] == r);
                const ids = filter.map((item) => item[0]);
                arr.push([...ids]);
            });
            return arr;
        }

        return [];
    }
    rankImgBgMap = [
        {
            bg_color: "#fea800",
            icon: "racing_rank_1",
        },
        {
            bg_color: "#a4c5d1",
            icon: "racing_rank_2",
        },
        {
            bg_color: "#e2ae86",
            icon: "racing_rank_3",
        },
    ];
    get isAllFinish(): boolean {
        const arr = Object.keys(this.data.matches);
        for (let match = 0; match < arr.length; match++) {
            const element = this.data.matches[arr[match]];
            if (this.getStates(element.id).match_phase == "OPEN") {
                return false;
            }
        }
        return true;
    }
    isShowP(event_id: number) {
        return this.getFixMarket(event_id)?.RB_WIN?.selections.findIndex((item: any) => item.metadata?.fluctuate?.length > 0) > -1;
    }

    isShowHeaderP(matches: any) {
        let type = false;
        Object.keys(matches).forEach((key) => {
            if (type) return;
            if (this.isShowP(matches[key].id)) {
                type = true;
            }
        });
        return type;
    }

    destroyed() {
        super.destroyed();
    }
}
