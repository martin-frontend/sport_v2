import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Emit } from "vue-property-decorator";
import LiveListMediator from "../mediator/LiveListMediator";
import LiveListProxy from "../proxy/LiveListProxy";
import LangUtil from "@/core/global/LangUtil";
import { EventLiveVO } from "@/vo/EventLiveVO";
import live from "../../live";
import matche from "../../matche";
import SportUtil from "@/core/global/SportUtil";
import page_racing_detail from "../../page_racing_detail";

@Component
export default class LiveList extends AbstractView {
    LangUtil = LangUtil;
    myProxy: LiveListProxy = this.getProxy(LiveListProxy);
    pageData = this.myProxy.pageData;
    isRaceEvent = SportUtil.isRaceEvent;

    constructor() {
        super(LiveListMediator);
    }

    onItemClick(item: any) {
        live.init(item.id);
        if (!this.isRaceEvent(this.myProxy.listQueryComp.sport_id)) {
            matche.init(item.id);
            this.$emit("onChange", item);
        } else {
            page_racing_detail.show({
                competitionId: item.competition_id,
                listQueryComp: { sport_id: item.sport_id, tag: item.tag },
                matchKey: item.number_of_session,
                event_id: item.id,
            });
        }
    }

    mounted() {
        if (this.myProxy.listQueryComp.sport_id == -1) {
            this.$router.push("/page_home");
        }
    }

    destroyed() {
        this.pageData.isOpen = false;
        super.destroyed();
    }
}
