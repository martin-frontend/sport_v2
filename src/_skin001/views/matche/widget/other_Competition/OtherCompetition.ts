import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { getResponseIcon } from "@/core/global/Functions";
import { formatEventTime, dateFormat, getDateByTimeZone } from "@/core/global/Functions";
import getProxy from "@/core/global/getProxy";

import MatcheProxy from "../../proxy/MatcheProxy";
import GlobalVar from "@/core/global/GlobalVar";
@Component
export default class OtherCompetition extends AbstractView {
    LangUtil = LangUtil;
    getResponseIcon = getResponseIcon;
    myProxy: MatcheProxy = getProxy(MatcheProxy);
    @Prop() matches!: any;
    @Prop() curevent_id!: Number;
    start_time(matche: any) {
        const timearr = <any>{};
        timearr.day = dateFormat(getDateByTimeZone(matche.sb_time * 1000, GlobalVar.zone), "MM/dd");
        timearr.min = dateFormat(getDateByTimeZone(matche.sb_time * 1000, GlobalVar.zone), "hh:mm");
        return timearr;
    }
    clickitem(matche: any) {
        this.myProxy.init(matche.id);
    }
    get currindex() {
        if (this.matches) {
            for (const key of this.matches.keys()) {
                if (this.matches[key].id == this.curevent_id) {
                    return key;
                }
            }
        }
        return 0;
    }
    set currindex(idx: Number) {
        idx = this.curevent_id;
    }
}
