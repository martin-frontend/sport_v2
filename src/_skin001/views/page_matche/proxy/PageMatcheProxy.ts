import PlatConfig from "@/core/config/PlatConfig";
import { objectRemoveNull } from "@/core/global/Functions";
// import GlobalVar from "@/core/global/GlobalVar";
import LangUtil from "@/core/global/LangUtil";
import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { EventStatesVO } from "@/vo/EventStatesVO";
import { MarketVO } from "@/vo/MarketVO";
import Vue from "vue";

export default class PageMatcheProxy extends puremvc.Proxy {
    static NAME = "PageMatcheProxy";

    private timer = 0;
    isLiveList = false;

    onRegister() {
        const { id, isVideo, event_id, anim_id } = Vue.router.currentRoute.query;
        this.pageData.anim_id = anim_id;
        if (isVideo == "true") {
            // 有直播 live_count> 0
            this.isLiveList = true;
            this.api_event_live_url(event_id);
        } else {
            if (this.pageData.event_states.length > 0 && this.pageData.pollCountStates == 0 && this.isLiveList) {
                if (this.pageData.competition_list[0].matches[0].animation_status == 1) {
                    this.pageData.isShowVideo = false;
                    this.pageData.isShowAnimation = true;
                }
            }
        }
        this.updateMarketTypeOptions();
        if(id)this.init(id);
        // this.init(188255);
    }

    onRemove() {
        clearInterval(this.timer);
        this.pageData.market_list = [];
        this.pageData.event_states = [];
        this.pageData.event_hot = [];
    }

    init(id: any) {
        this.onRemove();
        this.listQueryComp.event_id = id.toString();
        this.listQueryMarket.event_id = id.toString();
        this.api_event_list();
        this.api_event_hot();
    }

    pageData = {
        loading: false,
        showMarket: false,
        isShowVideo: false,
        isShowAnimation: false,
        isOpenAll: true,
        isNeedOpenAll: true,
        //联赛下的所有列表
        Allcompetition_list: <CompetitionVO[]>[],
        panelIndexs: <number[]>[],
        /**当前打开联赛列表 */
        competition_list: <CompetitionVO[]>[],
        /**盘口信息 */
        market_list: <MarketVO[]>[],
        /**赛事进程 */
        event_states: <EventStatesVO[]>[],
        start_time: 0,
        liveUrl: "",
        anim_id: "",

        // 轮询返回次数
        pollCountMarket: 0,
        pollCountStates: 0,

        //热门赛事
        event_hot: <any>[],

        //滚动条的位置
        scrollOffset: 0,
    };

    listQueryComp = {
        sport_id: 1,
        event_id: "",
        unique: PageMatcheProxy.NAME,
    };

    listQueryCompetition = {
        sport_id: 1,
        competition_id: "",
        unique: "matche_competition",
    };

    listQueryMarket = {
        type: "fix",
        event_id: "",
        market_type: 0,
        unique: PageMatcheProxy.NAME,
    };

    marketTypeOptions:any[] = [];

    updateMarketTypeOptions(){
        const arr = [{id: 0, name: LangUtil("所有")}];
        arr.push(...PlatConfig.market_main_type);
        this.marketTypeOptions = arr;
    }

    set_liveUrl(url: string) {
        this.pageData.liveUrl = url;
    }
    set_event_competition_list(data: any) {
        this.pageData.Allcompetition_list = data[0];
    }
    set_event_list(data: any) {
        this.pageData.loading = false;
        this.pageData.competition_list = data;
        this.listQueryCompetition.competition_id = data[0].competition_id;
        this.pageData.start_time = data[0].matches[0].sb_time;
        this.api_market_typelist();
        this.api_event_states();
        this.timer = setInterval(() => {
            this.api_market_typelist();
            this.api_event_states();
        }, 2000);
    }
    set_market_typelist(data: any) {
        if (this.pageData.isNeedOpenAll) {
            this.pageData.isNeedOpenAll = false;
            this.pageData.market_list = [];
            setTimeout(() => {
                this.pageData.panelIndexs = [
                    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33,
                ];
            }, 500);
        }

        setTimeout(() => {
            for (const item of data) {
                for (const key of Object.keys(item.fix_markets)) {
                    const market = item.fix_markets[key];
                    market.selections = market.selections.filter((item: any) => item.status == 0);
                }
                this.pageData.market_list = [item];
            }
            this.pageData.loading = false;
            this.pageData.showMarket = true;
        }, 100);

        this.pageData.pollCountMarket++;
    }
    set_event_states(data: any) {
        for (const item of data) {
            const finditem = this.pageData.event_states.find((item1) => item.event_id == item1.event_id);
            if (finditem) {
                Object.assign(finditem, item);
            } else {
                this.pageData.event_states.push(item);
            }
        }
        if (this.pageData.event_states.length > 0 && this.pageData.pollCountStates == 0 && this.isLiveList) {
            const vuetify = Vue.vuetify;
            if (vuetify.framework.breakpoint.mobile) {
                this.pageData.isShowVideo = true; //开启直播
                // if (this.pageData.liveUrl != "") {
                //     this.pageData.isShowVideo = true; //开启直播
                // } else {
                //     if (this.pageData.competition_list[0].matches[0].animation_status == 1) {
                //         this.pageData.isShowVideo = false;
                //         this.pageData.isShowAnimation = true;
                //     }
                // }
            }
        }

        this.pageData.pollCountStates++;
    }

    set_event_hot(data:any){
        this.pageData.event_hot = data;
    }

    /**取得直播连结*/
    api_event_live_url(event_id: any) {
        this.sendNotification(net.HttpType.api_event_live_url, {
            event_id: event_id,
        });
    }
    /**赛事接口-新*/
    api_event_list() {
        this.pageData.loading = true;
        this.sendNotification(net.HttpType.api_event_list, objectRemoveNull(this.listQueryComp));
    }
    /**根据联赛id获取联赛的所有比赛信息*/
    api_event_competition_list() {
        this.pageData.loading = true;
        this.sendNotification(net.HttpType.api_event_list, objectRemoveNull(this.listQueryCompetition));
    }

    /**盘口接口-新*/
    api_market_typelist() {
        let market_type = "";
        switch (this.listQueryMarket.market_type) {
            case 0:
                market_type = PlatConfig.allMarketType.map((item) => item.market_type).toString();
                break;
            default: {
                const arr = PlatConfig.allMarketType.filter(item => item.main_type.split(",").includes(this.listQueryMarket.market_type.toString()));
                market_type = arr.map(item => item.market_type).toString();
            }
        }
        const formCopy = JSON.parse(JSON.stringify(this.listQueryMarket));
        formCopy.market_type = market_type;
        this.sendNotification(net.HttpType.api_market_typelist, objectRemoveNull(formCopy));
    }
    /**赛事进程*/
    api_event_states() {
        const { event_id, unique } = this.listQueryMarket;
        const ids = <any>this.pageData.event_hot.map((item:any) => item.id);
        ids.push(event_id);
        const idsstr =  ids.toString();
        this.sendNotification(net.HttpType.api_event_states, { event_id: idsstr, unique });
    }
    /**热门赛事 */
    api_event_hot() {
        this.sendNotification(net.HttpType.api_event_hot);
    }
}
