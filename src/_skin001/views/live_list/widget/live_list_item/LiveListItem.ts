import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { EventLiveVO } from "@/vo/EventLiveVO";
import LiveListProxy from "../../proxy/LiveListProxy";

@Component
export default class LiveListItem extends AbstractView {
    LangUtil = LangUtil;
    myProxy: LiveListProxy = this.getProxy(LiveListProxy);
    pageData = this.myProxy.pageData;

    @Prop() data!: EventLiveVO;

    /**赛事进程 */
    get states() {
        return this.pageData.states.find((item) => item.event_id == this.data.id);
    }
}
