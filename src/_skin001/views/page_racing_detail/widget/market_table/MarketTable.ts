import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Prop } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { dateFormat, getDateByTimeZone } from "@/core/global/Functions";

@Component
export default class MarketTable extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    isShowDetail = true;

    destroyed() {
        super.destroyed();
    }
}
