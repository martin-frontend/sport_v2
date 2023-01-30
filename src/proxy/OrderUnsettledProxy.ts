import Vue from "vue";
import { objectRemoveNull } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import net from "@/net/setting";

export default class OrderUnsettledProxy extends puremvc.Proxy {
    static NAME = "OrderUnsettledProxy";

    /**计时器 */
    private timer = 0;
    public onRegister(): void {
        this.init();
    }

    pageData = {
        list: <any>[],
        states: <any>[], //滚球 数据是state
        pageInfo: {
            pageCurrent: 1,
            pageCount: 1,
            pageSize: 100,
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
        unique: OrderUnsettledProxy.NAME,
    };
    listQuery: any = {
        is_settle: 0, //1=已结算 0=未结算
        page_count: 1,
        page_size: 20,
        pageInfo: { pageCurrent: 0 },
        "settle_time-{>=}": "",
        "settle_time-{<=}": "",
        unique: OrderUnsettledProxy.NAME,
    };

    init() {
        clearInterval(this.timer);
        this.timer = setInterval(this.api_event_states.bind(this), 5000);
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

    set_user_orders(data: any) {
        this.listQueryMarket.event_id = "";
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

        this.api_event_states();
    }

    set_event_states(data: any) {
        this.pageData.states = data;
    }

    /**赛事进程*/
    api_event_states() {
        const event_ids: number[] = this.pageData.list.map((item: any) => item.event_id);
        this.listQueryMarket.event_id = event_ids.toString();
        const { event_id, unique } = this.listQueryMarket;
        if (event_id) {
            this.sendNotification(net.HttpType.api_event_states, { event_id, unique });
        }
    }
    api_user_orders() {
        GlobalVar.loading = true;
        this.sendNotification(net.HttpType.api_user_orders, objectRemoveNull(this.listQuery));
    }

    event_states(Orderitem: any) {
        const itemState = this.pageData.states.find((item: any) => Orderitem.event_id == item.event_id);
        if (itemState) {
            Orderitem.playingstate = itemState;
            return Orderitem;
        } else {
            return Orderitem;
        }
    }
}
