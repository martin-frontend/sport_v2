import SportUtil from "@/core/global/SportUtil";
import net from "@/net/setting";
import { EventLiveVO } from "@/vo/EventLiveVO";
import { EventStatesVO } from "@/vo/EventStatesVO";

export default class LiveListProxy extends puremvc.Proxy {
    static NAME = "LiveListProxy";

    private timer = 0;
    public onRegister(): void {
        // this.api_event_live_list_v2();
        this.timer = setInterval(this.api_event_states.bind(this), 5000);
    }

    public onRemove(): void {
        clearInterval(this.timer);
    }

    pageData = {
        loading: false,
        /**直播列表 */
        list: <EventLiveVO[]>[],
        /**赛事进程 */
        states: <EventStatesVO[]>[],
        isOpen: false,
    };

    listQueryComp = {
        // 1 足球、4 篮球、5 美式足球、7 赛马、8 赛狗
        sport_id: -1,
        page_size: 1000,
        page_count: 1,
        unique: LiveListProxy.NAME,
    };

    set_event_live_list(data: any) {
        this.pageData.loading = false;
        this.pageData.list = data.list;
    }

    set_event_live_list_v2(data: any) {
        this.pageData.loading = false;
        this.pageData.list = data;
    }
    set_event_states(data: any) {
        this.pageData.states = data;
    }

    /**直播清单接口*/
    api_event_live_list() {
        this.pageData.loading = true;
        this.sendNotification(net.HttpType.api_event_live_list, { page_count: 1, page_size: 50 });
    }

    api_event_live_list_v2() {
        this.pageData.loading = true;
        this.sendNotification(net.HttpType.api_event_live_list_v2, this.listQueryComp);
    }

    /**赛事进程*/
    api_event_states() {
        if (!this.pageData.isOpen || SportUtil.isRaceEvent(this.listQueryComp.sport_id)) return;
        const event_id = this.pageData.list.map((item) => item.id);
        if (event_id.length > 0) {
            this.sendNotification(net.HttpType.api_event_states, { event_id: event_id.toString(), unique: LiveListProxy.NAME });
        }
    }
}
