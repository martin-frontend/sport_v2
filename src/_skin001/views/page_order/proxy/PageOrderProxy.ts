import { getTodayOffset, objectRemoveNull } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import net from "@/net/setting";
import Vue from "vue";

export default class PageOrderProxy extends puremvc.Proxy {
    static NAME = "PageOrderProxy";

    /**计时器 */
    private timer = 0;
    pageData = {
        list: <any>[],
        states: <any>[],//滚球 数据是state
        pageInfo: {
            pageCurrent: 1,
            pageCount: 1,
            pageSize: 20,
            pageTotal: 1,
        },
        stats: {
            total_stake: "0.000", // 总投注
            total_win: "0.000", // 总输赢
            total_expected_win: "0.000", // 总预计输赢
            total_count: 1, // 总注单数
        },
        // 列表是否加载完成，手机模式专用
        finished: false,
        done: <any>null,
        isActive: 0,
        settleCount: 0, //未结算数
    };
    listQueryMarket = {
        // 多个指定赛事id，以逗号拼接
        event_id: "",
        // 记录所在位置
        unique: PageOrderProxy.NAME
    };
    listQuery: any = {
        is_settle: 0, //1=已结算 0=未结算
        page_count: 1,
        page_size: 10,
        pageInfo: { pageCurrent: 0 },
        "settle_time-{>=}": "",
        "settle_time-{<=}": "",
    };
    onRegister() {
        
        this.init();
    }
    init() {
        clearInterval(this.timer);
        this.timer = setInterval(this.getMarketAndStates.bind(this), 5000);
    }
    onReset() {
        this.pageData.list = [];
        this.listQuery.page_count = 1;
        this.pageData.isActive = 0;
        if (this.listQuery.is_settle == 1) {
            this.listQuery["settle_time-{>=}"] = getTodayOffset().timestr;
            this.listQuery["settle_time-{<=}"] = getTodayOffset(1,-1).timestr;
        } else {
            this.listQuery["settle_time-{>=}"] = "";
            this.listQuery["settle_time-{<=}"] = "";
        }
    }

    set_user_orders(data: any) {
        this.listQueryMarket.event_id = '';
        GlobalVar.loading = false;
        Object.assign(this.pageData.stats, data.stats);
        Object.assign(this.pageData.pageInfo, data.pageInfo);
        const vuetify = Vue.vuetify;
        if (vuetify.framework.breakpoint.mobile) {
            const { pageCount, pageCurrent } = this.pageData.pageInfo;
            if (pageCurrent == 1) {
                this.pageData.list = data.list;
            } else {
                this.pageData.list.push(...data.list);
            }
            this.pageData.finished = pageCurrent == pageCount;
            this.pageData.done && this.pageData.done();
        } else {
            this.pageData.list.push(...data.list);
        }
        const event_id: number[] = [];
        if (this.listQuery.is_settle == 0) {
            data.list.forEach((item: any, idx: any) => {
                event_id.push(item.event_id);
           
           });
           this.listQueryMarket.event_id = event_id.toString();
           this.api_event_states();
        }
       
        
    }
    /**赛事进程*/
    api_event_states() {
        if (this.listQuery.is_settle != 0 || !this.listQueryMarket.event_id) {
            return
        }
        
        const { event_id, unique } = this.listQueryMarket;
        this.sendNotification(net.HttpType.api_event_states, { event_id, unique });
    }
    api_user_orders() {
        GlobalVar.loading = true;
        this.sendNotification(net.HttpType.api_user_orders, objectRemoveNull(this.listQuery));
    }

    /**手机下拉刷新 */
    listRefrush(done: any) {
        this.pageData.done = done;
        this.listQuery.page_count = 1;
        this.api_user_orders();
    }
    /**手机上拉加载更多 */
    listMore(done: any) {
        this.pageData.done = done;
        this.listQuery.page_count++;
        this.api_user_orders();
    }

    get_order_by_limit(type: number) {
        this.listQuery.page_count = 1;
        switch (type) {
            // 今日
            case 0:
                
                this.listQuery["settle_time-{>=}"] = getTodayOffset().timestr;
                this.listQuery["settle_time-{<=}"] = getTodayOffset(1,-1).timestr;
                break;
            // 昨天
            case -1:
                this.listQuery["settle_time-{>=}"] = getTodayOffset(-1).timestr;
                this.listQuery["settle_time-{<=}"] = getTodayOffset(0,-1).timestr;
                break;
            // 7天
            case 7:
                this.listQuery["settle_time-{>=}"] = getTodayOffset(-7).timestr;
                this.listQuery["settle_time-{<=}"] = getTodayOffset(1,-1).timestr;
                break;
            // 30天
            case 30:
                this.listQuery["settle_time-{>=}"] = getTodayOffset(-30).timestr;
                this.listQuery["settle_time-{<=}"] = getTodayOffset(1,-1).timestr;
                break;

            default:
                break;
        }
        this.pageData.list = [];
        this.api_user_orders();
    }
    set_event_states(data:any){
        
        this.pageData.states =data;//"www":data[0]

        // data.forEach((state:any,index:any) => {
        //     this.pageData.playing_list[state.event_id] = state;
        // });
    }
    event_states(Orderitem:any){
       const itemState = this.pageData.states.find((item:any)=>Orderitem.event_id == item. event_id);
        if (itemState) {
            Orderitem.playingstate = itemState;
            return Orderitem;
        }else
        {
            return Orderitem;
        }
    }
    getMarketAndStates() {
        //@ts-ignore
        if (this.listQuery.is_settle != 0) {
            return
        }
            const event_id: number[] = [];
            for (const item of this.pageData.list) {
                event_id.push(item.event_id);
            }
            this.listQueryMarket.event_id = event_id.toString();
            if (this.listQueryMarket.event_id) {
                this.api_event_states();
            }
    }
}
