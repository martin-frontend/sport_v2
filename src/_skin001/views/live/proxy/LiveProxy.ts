import SportUtil from "@/core/global/SportUtil";
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
        competition_list: <any>[],
        /**赛事进程 */
        event_states: <EventStatesVO[]>[],
        //直播地址
        live_url: "",
        //动画ID
        animation_id: "",
    };

    listQueryComp = {
        event_type: 1,
        sport_id: 1,
        event_id: "",
        unique: LiveProxy.NAME,
    };

    set_event_list(data: any) {
        this.pageData.competition_list = data;
        if (SportUtil.isRaceEvent(this.listQueryComp.sport_id)) {
            const competition = this.pageData.competition_list[0];
            if (competition) {
                const match: any = Object.entries(competition.matches)[0][1];
                this.pageData.animation_id = match?.animation_id;
                this.pageData.live_url = match?.live_url;
                this.listQueryComp.event_id = match?.id;
            }
        } else {
            this.pageData.animation_id = this.pageData.competition_list[0]?.matches[0]?.animation_id;
            this.pageData.live_url = this.pageData.competition_list[0]?.matches[0]?.live_url;
            this.listQueryComp.event_id = this.pageData.competition_list[0]?.matches[0]?.id;
        }
        this.api_event_states();
    }

    set_event_states(data: any) {
        this.pageData.loading = false;
        this.pageData.event_states = data;
    }

    /**赛事进程*/
    api_event_states() {
        if (this.listQueryComp.event_id) {
            this.sendNotification(net.HttpType.api_event_states, {
                event_id: this.listQueryComp.event_id.toString(),
                unique: LiveProxy.NAME,
            });
        } else {
            this.pageData.loading = false;
        }
    }

    /**赛事接口-新*/
    api_event_list() {
        this.pageData.loading = true;
        this.pageData.animation_id = "";
        this.pageData.live_url = "";
        this.pageData.event_states = [];
        this.listQueryComp.event_type = SportUtil.isRaceEvent(this.listQueryComp.sport_id) ? 2 : 1;
        this.sendNotification(net.HttpType.api_event_list_v3, {
            ...this.listQueryComp,
        });
    }
}
