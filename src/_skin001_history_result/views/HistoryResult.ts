import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import historyResultMediator from "../mediator/historyResultMediator";
import historyResultProxy from "../proxy/historyResultProxy";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import { getQueryVariable } from "@/core/global/Functions";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import { getResponseIcon, amountFormat, dateFormat, TransMarketPrice, getDateByTimeZone } from "@/core/global/Functions";
import CopyUtil from "@/core/global/CopyUtil"
import EnumMarketType from "@/core/global/MarketUtils";
const marketType = EnumMarketType.EnumMarketType;
@Component
export default class PageOrderDetail extends AbstractView{
    LangUtil = LangUtil;
    dateFormat =dateFormat;
    amountFormat = amountFormat;
    getDateByTimeZone=getDateByTimeZone;
    getResponseIcon = getResponseIcon;
    TransMarketPrice = TransMarketPrice;
    
    OrderTitleUtils= OrderTitleUtils;
    myProxy: historyResultProxy = getProxy(historyResultProxy);
    pageData = this.myProxy.pageData;
    listQuery = this.myProxy.listQuery;

    GlobalVar=GlobalVar;
    bShowDateSelect= false;
    SelectDate1 = "";
    SelectDate2 = "";
    form = {
        lang: getQueryVariable("lang") || "zh_CN",
        order_id: getQueryVariable("order_id"),
        plat_id: getQueryVariable("plat_id"),
        timezone: getQueryVariable("timezone"),
        sign: getQueryVariable("sign"),
        token:getQueryVariable("t") || "",
    };
    constructor() {
        super(historyResultMediator);
    }
    // 注单状态
    statusMap = {
        0: LangUtil("确认中"), //确认中
        1: LangUtil("确认成功"), //确认成功
        3: LangUtil("已拒绝"), //拒绝
        4: LangUtil("已取消"), //拒绝
        5: LangUtil("无效"), //无效
        8: LangUtil("准异常"), //准异常
    };
    //根据盘口展示已结算的赛果角球还是比分等
    getHadResultStr(item: any){
        const copyitem = JSON.parse(JSON.stringify(item));
        copyitem.state = copyitem.real_time_state;

        return OrderTitleUtils.getScoreStr(copyitem);
    }
    mounted() {
        this.myProxy.api_public_plat_config();

    }
    pageLoad() {
        this.listQuery.page_count++;
        this.myProxy.api_user_orders();
    }
    transTime(_t: any) {
        return dateFormat(getDateByTimeZone(_t * 1000, GlobalVar.zone), "hh:mm:ss");
    }
     //今日 昨日 7天 30天
     onLimitOrder(type: any) {
        this.pageData.isActive = type;
        this.myProxy.get_order_by_limit(type);
        this.onWatchselectDate();
    }
    onSelectDate(){
        this.bShowDateSelect = false;
        this.pageData.isActive = 1000;
        this.myProxy.get_order_selectdata(this.myProxy.selectDate);
    }
    @Watch("myProxy.selectDate")
    onWatchselectDate() {
        
        const sel1 = this.myProxy.selectDate[0];
        const sel2 = this.myProxy.selectDate[1];
        if (sel1 && sel2 && Date.parse(sel1) > Date.parse(sel2)) {
            this.myProxy.selectDate = [sel2,sel1];
        }
         this.SelectDate1 = <any>this.formatDate(this.myProxy.selectDate[0]);
         this.SelectDate2 = <any>this.formatDate(this.myProxy.selectDate[1]);
        this.myProxy.selectDate[0] = this.myProxy.selectDate[0].replaceAll('/', '-');
        this.myProxy.selectDate[1] = this.myProxy.selectDate[1].replaceAll('/', '-');
        console.warn("selectDateselectDate>>"+this.myProxy.selectDate)
    }
    formatDate (date:any) {
        if (!date) return null
  
        const [year, month, day] = date.split('-')
        if (year && month && day) {
             return `${year}/${month}/${day}`
         }else{
             return date;
         }
      }
 
    onfresh(){
        
        this.myProxy.listQuery.page_count = 1;
        this.pageData.list = [];
        this.myProxy.get_order_selectdata(this.myProxy.selectDate);
        
    }
    onCopyOrder(order:any){
            CopyUtil(order);
            alert(LangUtil("复制成功"))
    }
    getResultStr(win:any){
        if (win==0) {
            return LangUtil("平手")
        }else if (win>0) {
            return LangUtil("赢")
        }else  {
            return LangUtil("输")
        }
    }
    

}
