import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { EventLiveVO } from "@/vo/EventLiveVO";
import { EventStatesVO } from "@/vo/EventStatesVO";

export default class LiveProxy extends puremvc.Proxy {
    static NAME = "LiveProxy";

    public onRegister(): void {
        setInterval(this.api_event_states.bind(this), 5000);
    }

    pageData = {
        loading: false,
        /**赛事列表 */
        competition_list: <CompetitionVO[]>[],
        /**赛事进程 */
        event_states: <EventStatesVO[]>[],
        //直播地址
        live_url: "",
        //动画ID
        animation_id: "",
    };

    listQueryComp = {
        type: "fix",
        sport_id: 1,
        event_id: "",
        unique: LiveProxy.NAME,
    };

    set_event_list(data: any) {
        this.pageData.competition_list = data;
        this.pageData.animation_id = this.pageData.competition_list[0]?.matches[0]?.animation_id;
        this.pageData.live_url = this.pageData.competition_list[0]?.matches[0]?.live_url;
        this.api_event_states();
    }

    set_event_states(data: any) {
        const event_id = this.pageData.competition_list[0]?.matches[0]?.id;
        if (!data[0] || data[0]?.event_id == event_id) {
            this.pageData.loading = false;
            this.pageData.event_states = data;
        }
    }

    /**赛事进程*/
    api_event_states() {
        const event_id = this.pageData.competition_list[0]?.matches[0]?.id;
        if (event_id) {
            this.sendNotification(net.HttpType.api_event_states, { event_id: event_id.toString(), unique: LiveProxy.NAME });
        }
    }

    /**赛事接口-新*/
    api_event_list() {
        this.pageData.loading = true;
        this.pageData.animation_id = "";
        this.pageData.live_url = "";
        this.pageData.event_states = [];
        this.sendNotification(net.HttpType.api_event_list_v3, {
            ...this.listQueryComp,
        });
    }
}
