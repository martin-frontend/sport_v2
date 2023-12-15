import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { dateFormat, getDateByTimeZone } from "@/core/global/Functions";

@Component
export default class ResultTable extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    window = 0;
    @Prop() match!: any;
    @Prop() states!: any;
    @Prop() markets!: any;
    rankingOption: any = { 1: "第一名", 2: "第二名", 3: "第三名", 4: "第四名" };

    getRankingStr(ranking: any) {
        const arr = this.runnersRanking.filter((item: any) => item.ranking == ranking);
        if (arr.length > 1) {
            const str = "并列" + this.rankingOption[ranking];
            return str;
        } else {
            return this.rankingOption[ranking];
        }
    }

    // 前4名跑者名次排序
    get runnersRanking() {
        const placings = this.states?.results?.placings;
        const arr: any = [];
        if (placings) {
            // 将物件转换为键值对的阵列
            const keyValueArray = Object.entries(placings);

            // 根据值的大小升幂排序阵列
            keyValueArray.sort((a: any, b: any) => a[1] - b[1]);

            keyValueArray.forEach((item) => {
                const runnerId = item[0];
                const ranking = item[1];
                const runner = this.match.runners.find(({ runner_id }: any) => runner_id == runnerId);
                arr.push({ ...runner, ranking });
            });
        }
        return arr;
    }

    isShowWin(ranking: any) {
        return ranking == 1;
    }

    isShowPlace(ranking: any) {
        const length = this.match.runners.length;
        if (length >= 8) {
            return [1, 2, 3].includes(Number(ranking));
        } else if (length >= 5 && length < 8) {
            return [1, 2].includes(Number(ranking));
        } else {
            return ranking == 1;
        }
    }

    getWin(runnerId: any) {
        return this.getWinSelection(runnerId)?.price?.back;
    }

    getPlace(runnerId: any) {
        return this.getPlaceSelection(runnerId)?.price?.back;
    }

    getPlaceSelection(runnerId: any) {
        return this.markets?.RB_PLACE?.selections?.find((item: any) => item.id == runnerId);
    }

    getWinSelection(runnerId: any) {
        return this.markets?.RB_WIN?.selections?.find((item: any) => item.id == runnerId);
    }

    // 退赛的
    get scratchedRunners() {
        return this.match.runners.filter((item: any) => item.scratched);
    }

    getScratchedTime(scratched_time: any) {
        return dateFormat(getDateByTimeZone(scratched_time * 1000, <any>GlobalVar.zone), "yyyy/MM/dd hh:mm:ss");
    }

    destroyed() {
        super.destroyed();
    }
}
