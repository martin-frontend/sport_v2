import net from "@/net/setting";
import GlobalVar from "@/core/global/GlobalVar";
import { getTodayOffset,objectRemoveNull, dateFormat, getDateByTimeZone } from "@/core/global/Functions";

export default class HistoryResultProxy extends puremvc.Proxy {
    static NAME = "HistoryResultProxy";
    public onRegister(): void {
        // TODO 请求初始数据
    }
    selectDate =['', ''];
    pageData = {
        list: <any>[],
        nodata:true,
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
    };
    listQuery: any = {
        is_settle: 1, //1=已结算 0=未结算
        page_count: 1,
        page_size: 10,
        pageInfo: { pageCurrent: 0 },
        "settle_time-{>=}": "",
        "settle_time-{<=}": "",
    };
    init() {
        this.sendNotification(net.HttpType.api_event_sports);
        this.sendNotification(net.HttpType.api_event_market_type_v2);
    }
    get_order_by_limit(type: number) {
        this.listQuery.page_count = 1;
        switch (type) {
            // 今日
            case 0:
           
                this.listQuery["settle_time-{>=}"] = getTodayOffset().timestr;
                this.listQuery["settle_time-{<=}"] = getTodayOffset(1,-1).timestr;
                this.selectDate[0] = getTodayOffset().formatdate;
                this.selectDate[1] = getTodayOffset().formatdate;
                break;
            // 昨天
            case -1:
                this.listQuery["settle_time-{>=}"] = getTodayOffset(-1).timestr;
                this.listQuery["settle_time-{<=}"] = getTodayOffset(0,-1).timestr;
                this.selectDate[0] = getTodayOffset(-1).formatdate;
                this.selectDate[1] = getTodayOffset(-1).formatdate;
                break;
            // 7天
            case 7:
                this.listQuery["settle_time-{>=}"] = getTodayOffset(-6).timestr;
                this.listQuery["settle_time-{<=}"] = getTodayOffset(1,-1).timestr;
                this.selectDate[0] = getTodayOffset(-6).formatdate;
                this.selectDate[1] = getTodayOffset().formatdate;
                break;
            // 30天
            case 30:
                this.listQuery["settle_time-{>=}"] = getTodayOffset(-29).timestr;
                this.listQuery["settle_time-{<=}"] = getTodayOffset(1,-1).timestr;
                this.selectDate[0] = getTodayOffset(-29).formatdate;
                this.selectDate[1] = getTodayOffset(1,-1).formatdate;
                break;

            default:
                break;
        }
        this.pageData.list = [];
        this.api_user_orders();
    }
    get_order_selectdata(selectDate:any){
        const symbal = GlobalVar.zone.substring(0, 1);
        let timezone = "GMT" + symbal;
        const arr = GlobalVar.zone.substring(1).split(":");
        if (arr.length == 1) {
            if (arr[0].length == 1) {
                timezone += "0" + arr[0] + "00";
            } else {
                timezone += arr[0] + "00";
            }
        } else {
            if (arr[0].length == 1) {
                timezone += "0" + arr[0] + arr[1];
            } else {
                timezone += arr[0] + arr[1];
            }
        }
        this.listQuery.page_count = 1;
        this.listQuery["settle_time-{>=}"] = Date.parse(selectDate[0] + " " + timezone) / 1000;
        this.listQuery["settle_time-{<=}"] = (Date.parse(selectDate[1] + " " + timezone)+86400000) / 1000-1;
        this.pageData.list = [];
        this.api_user_orders();
    }
    
    set_user_orders(data: any) {
        GlobalVar.loading = false;
        Object.assign(this.pageData.stats, data.stats);
        Object.assign(this.pageData.pageInfo, data.pageInfo);
        this.pageData.list.push(...data.list);   
        if (this.pageData.list.length == 0) {
            this.pageData.nodata = true;
        }else{
            this.pageData.nodata = false;
        }
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
    api_user_orders() {
        this.sendNotification(net.HttpType.api_user_orders, objectRemoveNull(this.listQuery));
    }

}
