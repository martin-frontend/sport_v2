import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component, Emit } from "vue-property-decorator";
import LiveListMediator from "../mediator/LiveListMediator";
import LiveListProxy from "../proxy/LiveListProxy";
import LangUtil from "@/core/global/LangUtil";
import { EventLiveVO } from "@/vo/EventLiveVO";
import live from "../../live";
import matche from "../../matche";

@Component
export default class LiveList extends AbstractView {
    LangUtil = LangUtil;
    myProxy: LiveListProxy = this.getProxy(LiveListProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(LiveListMediator);
    }

    onItemClick(item: EventLiveVO) {
        live.init(item.id);
        matche.init(item.id);
        this.$emit("onChange", item);
    }

    destroyed() {
        super.destroyed();
    }
}
