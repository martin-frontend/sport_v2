import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { dateFormat, getDateByTimeZone } from "@/core/global/Functions";
import PageRacingDetailProxy from "../../proxy/PageRacingDetailProxy";

@Component
export default class MarketsTable extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    isShowDetail = false;
    myProxy: PageRacingDetailProxy = this.getProxy(PageRacingDetailProxy);
    pageData = this.myProxy.pageData;
    @Prop() match!: any;
    @Prop() states!: any;
    @Prop() markets!: any;

    // 參赛的
    get runners() {
        return this.match.runners.filter((item: any) => !item.scratched);
    }

    // 退赛的
    get scratchedRunners() {
        return this.match.runners.filter((item: any) => item.scratched);
    }

    getScratchedTime(scratched_time: any) {
        return dateFormat(getDateByTimeZone(scratched_time * 1000, <any>GlobalVar.zone), "yyyy/MM/dd hh:mm:ss");
    }

    getPlaceSelection(runnerId: any) {
        return this.markets?.RB_PLACE?.selections?.find((item: any) => item.id == runnerId);
    }

    getWinSelection(runnerId: any) {
        return this.markets?.RB_WIN?.selections?.find((item: any) => item.id == runnerId);
    }

    getFluctuate(runnerId: any) {
        return this.getWinSelection(runnerId)?.metadata.fluctuate ?? [];
    }

    // 价格组波动：开放价格 + 多次价格 (max: 8)
    getFluctuatingPriceArr(runnerId: any) {
        const arr = this.getFluctuate(runnerId);
        if (arr.length > 8) {
            return [arr[0], ...arr.slice(-7)];
        } else {
            return arr.slice(-8);
        }
    }

    getOpenPrice(runnerId: any) {
        return this.getFluctuate(runnerId)[0] ?? 0;
    }

    getPrice1(runnerId: any) {
        const arr = this.getFluctuate(runnerId);
        return arr[arr.length - 2] ?? 0;
    }

    getPrice2(runnerId: any) {
        const arr = this.getFluctuate(runnerId);
        return arr[arr.length - 1] ?? 0;
    }

    getWin(runnerId: any) {
        const selection = this.getWinSelection(runnerId);
        return selection?.price?.back ?? 0;
    }

    getPlace(runnerId: any) {
        const selection = this.getPlaceSelection(runnerId);
        return selection?.price?.back ?? 0;
    }

    get favRunnerId() {
        const selections = this.markets?.RB_WIN?.selections ?? [];
        if (selections.length == 0) return -1;
        const runner = selections.reduce(
            (minRunner: any, currentRunner: any) => {
                if (currentRunner?.price?.back) {
                    return Number(currentRunner?.price?.back) < Number(minRunner?.price?.back) ? currentRunner : minRunner;
                }
                return minRunner;
            },
            { id: -1, price: { back: 999999 } }
        );
        return runner?.id;
    }

    get rules() {
        const length = this.match.runners.length;
        if (length >= 8) {
            return "";
        }
        if (length >= 5 && length < 8) {
            return LangUtil("其他规则: 第三名没有奖励");
        } else {
            return LangUtil("其他规则: 只有第一名有奖励");
        }
    }

    get isShowPlace() {
        return this.match.runners.length > 5 && this.markets?.RB_PLACE?.selections?.findIndex((item: any) => item.price.back > 0) > -1;
    }

    destroyed() {
        super.destroyed();
    }
}
