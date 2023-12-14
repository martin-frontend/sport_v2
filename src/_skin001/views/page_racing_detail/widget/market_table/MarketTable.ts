import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { dateFormat, getDateByTimeZone } from "@/core/global/Functions";

@Component
export default class MarketsTable extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    isShowDetail = false;
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

    get rules() {
        const length = this.match.runners.length;
        if (length >= 8) {
            return "";
        }
        if (length >= 5 && length < 8) {
            return LangUtil("其他规则: 第三名没有奖励");
        } else {
            return LangUtil("其他规则：只有第一名有奖励");
        }
    }

    destroyed() {
        super.destroyed();
    }
}
