import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Emit } from "vue-property-decorator";
import LiveListMediator from "../mediator/LiveListMediator";
import LiveListProxy from "../proxy/LiveListProxy";
import LangUtil from "@/core/global/LangUtil";
import { EventLiveVO } from "@/vo/EventLiveVO";
import live from "../../live";
import matche from "../../matche";
import SportUtil from "@/core/global/SportUtil";

@Component
export default class LiveList extends AbstractView {
    LangUtil = LangUtil;
    myProxy: LiveListProxy = this.getProxy(LiveListProxy);
    pageData = this.myProxy.pageData;
    isRaceEvent = SportUtil.isRaceEvent;

    constructor() {
        super(LiveListMediator);
    }

    onItemClick(item: EventLiveVO) {
        live.init(item.id);
        if (!this.isRaceEvent(this.myProxy.listQueryComp.sport_id)) {
            matche.init(item.id);
        }
        this.$emit("onChange", item);
    }

    destroyed() {
        this.pageData.isOpen = false;
        super.destroyed();
    }
}
