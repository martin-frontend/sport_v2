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
        unique: "pageOrders"
    };
    listQuery: any = {
        is_settle: 0, //1=已结算 0=未结算
        page_count: 1,
        page_size: 10,
        pageInfo: { pageCurrent: 0 },
        "settle_time-{>=}": "",
        "settle_time-{<=}": "",
    };

    init() {
        clearInterval(this.timer);
        // this.timer = setInterval(this.getMarketAndStates.bind(this), 5000);
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
}
