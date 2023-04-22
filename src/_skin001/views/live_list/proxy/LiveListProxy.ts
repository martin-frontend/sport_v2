import net from "@/net/setting";
import { EventLiveVO } from "@/vo/EventLiveVO";
import { EventStatesVO } from "@/vo/EventStatesVO";

export default class LiveListProxy extends puremvc.Proxy {
    static NAME = "LiveListProxy";

    private timer = 0;
    public onRegister(): void {
        this.api_event_live_list();
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
    };

    set_event_live_list(data: any) {
        this.pageData.loading = false;
        this.pageData.list = data.list;
    }
    set_event_states(data: any) {
        this.pageData.states = data;
    }

    /**直播清单接口*/
    api_event_live_list() {
        this.pageData.loading = true;
        this.sendNotification(net.HttpType.api_event_live_list, { page_count: 1, page_size: 50 });
    }

    /**赛事进程*/
    api_event_states() {
        const event_id = this.pageData.list.map((item) => item.id);
        if (event_id.length > 0) {
            this.sendNotification(net.HttpType.api_event_states, { event_id: event_id.toString(), unique: LiveListProxy.NAME });
        }
    }
}
