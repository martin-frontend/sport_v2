import Vue from "vue";
import { objectRemoveNull } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import net from "@/net/setting";

export default class OrderUnsettledProxy extends puremvc.Proxy {
    static NAME = "OrderUnsettledProxy";

    /**计时器 */
    private timer = 0;
    public onRegister(): void {
        // this.init();
    }

    pageData = {
        loading: false,
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
        order_no: "", // 可提前结算注单
        precashoutData: <any>{}, //存取 precashout 回传的资料
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
        cash_out_status: "",
    };

    init(cash_out_status: any = "") {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            this.api_event_states();
            this.api_user_precashout();
        }, 5000);
        this.listQuery.page_count = 1;
        this.listQuery.cash_out_status = cash_out_status;
        // this.api_user_orders();
        this.api_user_orders_v3();
    }
    clear() {
        clearInterval(this.timer);
    }

    /**手机下拉刷新 */
    listRefrush(done: any) {
        this.pageData.done = done;
        this.listQuery.page_count = 1;
        // this.api_user_orders();
        this.api_user_orders_v3();
    }
    /**手机上拉加载更多 */
    listMore(done: any) {
        this.pageData.done = done;
        this.listQuery.page_count++;
        // this.api_user_orders();
        this.api_user_orders_v3();
    }

    set_user_orders(data: any) {
        this.listQueryMarket.event_id = "";
        // GlobalVar.loading = false;
        Object.assign(this.pageData.stats, data.stats);
        Object.assign(this.pageData.pageInfo, data.pageInfo);
        const { pageCount, pageCurrent } = this.pageData.pageInfo;
        if (pageCurrent == 1) {
            this.pageData.list = data.list;
        } else {
            this.pageData.list.push(...data.list);
        }
        const vuetify = Vue.vuetify;
        if (vuetify.framework.breakpoint.mobile) {
            this.pageData.finished = pageCurrent == pageCount;
            this.pageData.done && this.pageData.done();
        }

        this.api_event_states();

        const canCashOutList: any = [];
        this.pageData.list.forEach((item: any) => {
            if (item.is_able_to_cash_out == 1) {
                canCashOutList.push(item.order_no);
            }
        });
        this.pageData.order_no = canCashOutList.join();
        this.api_user_precashout();
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
        // GlobalVar.loading = true;
        this.pageData.loading = true;
        this.sendNotification(net.HttpType.api_user_orders, objectRemoveNull(this.listQuery));
    }
    api_user_orders_v3() {
        // GlobalVar.loading = true;
        this.pageData.loading = true;
        this.sendNotification(net.HttpType.api_user_orders_v3, objectRemoveNull(this.listQuery));
    }

    api_user_precashout() {
        const { order_no } = this.pageData;
        const { is_settle } = this.listQuery;
        if (!order_no || is_settle == 1) {
            this.pageData.loading = false;
            return;
        }
        this.sendNotification(net.HttpType.api_user_precashout, { order_no });
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

    set_cashout(data: any) {
        this.pageData.loading = false;
        const keys = Object.keys(data);
        keys.forEach((key) => {
            const findItem = this.pageData.list.find((item: any) => item.order_no == key);
            if (findItem) {
                const { code, cash_out_status } = data[key];
                findItem.cash_out_status = cash_out_status;
                if (code == 0 && cash_out_status == 1) {
                    Object.assign(findItem, data[key]);
                    this.pageData.precashoutData[key] = data[key];
                }
                if (cash_out_status == 2 || cash_out_status == 3 || cash_out_status == 4) {
                    findItem.amount = this.pageData.precashoutData[key]?.amount;
                }
                if (cash_out_status == 5) findItem.is_able_to_cash_out = 0;
            }
        });
    }
}
