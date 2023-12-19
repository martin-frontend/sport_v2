import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { EventLiveVO } from "@/vo/EventLiveVO";
import LiveListProxy from "../../proxy/LiveListProxy";
import { dateFormat, formatEventTime, getDateByTimeZone, getResponseIcon } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import SportUtil from "@/core/global/SportUtil";
import Assets from "@/_skin001/assets/Assets";

@Component
export default class LiveListItem extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    getResponseIcon = getResponseIcon;
    myProxy: LiveListProxy = this.getProxy(LiveListProxy);
    pageData = this.myProxy.pageData;
    sportIcon = Assets.SportIcon;
    isRaceEvent = SportUtil.isRaceEvent;

    @Prop() data!: EventLiveVO;
    /**赛事进程 */
    get states() {
        return this.pageData.states.find((item) => item.event_id == this.data.id);
    }

    get start_time() {
        //@ts-ignore
        return dateFormat(getDateByTimeZone(this.data.start_time_timestamp * 1000, GlobalVar.zone), "MM-dd hh:mm");
    }

    get race_start_time() {
        //@ts-ignore
        return dateFormat(getDateByTimeZone(this.data.start_time_timestamp * 1000, GlobalVar.zone), "MM/dd");
    }
}
