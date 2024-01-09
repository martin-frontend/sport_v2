import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import Vue from "vue";
import live from "../../live";
import matche from "../../matche";
export default class PageMatcheProxy extends puremvc.Proxy {
    static NAME = "PageMatcheProxy";

    public onRegister(): void {
        const { id } = Vue.router.currentRoute.query;
        live.init(id);
        matche.init(id);
    }

    pageData = {
        //控制直播的标签
        liveIndex: 0,
        //是否显示当前联赛中赛事列表
        isShowList: false,

        competition_list: <CompetitionVO[]>[],
    };

    set_event_list(data: any) {
        this.pageData.competition_list = data;
    }

    /**赛事接口-新*/
    api_event_list(competition_id: number) {
        const data = {
            sport_id: 1,
            type: "fix",
            competition_id,
            unique: PageMatcheProxy.NAME,
        };
        this.sendNotification(net.HttpType.api_event_list_v3, data);
    }
}
