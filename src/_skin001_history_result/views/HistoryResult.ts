import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import historyResultMediator from "../mediator/historyResultMediator";
import historyResultProxy from "../proxy/historyResultProxy";
import Http from "@/core/Http";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import PlatConfig from "@/core/config/PlatConfig";
import GlobalVar from "@/core/global/GlobalVar";
import LangConfig from "../core/config/LangConfig";
import { getQueryVariable } from "@/core/global/Functions";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import { getResponseIcon, amountFormat, dateFormat, TransMarketPrice, getDateByTimeZone } from "@/core/global/Functions";
import CopyUtil from "@/core/global/CopyUtil"
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
    isloadSecLang = false;
    bShowDateSelect= false;
    nowtime :any;
    form = {
        lang: getQueryVariable("lang") || "zh_CN",
        order_id: getQueryVariable("order_id"),
        plat_id: getQueryVariable("plat_id"),
        timezone: getQueryVariable("timezone"),
        sign: getQueryVariable("sign"),
        token:getQueryVariable("t") || "",
        MarketType_area:getQueryVariable("MarketType_area"),
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
    };
    //根据盘口展示已结算的赛果角球还是比分等
    getHadResultStr(item: any){
        const copyitem = JSON.parse(JSON.stringify(item));
        copyitem.state = copyitem.real_time_state;

        return OrderTitleUtils.getScoreStr(copyitem);
    }
    mounted() {
        
        
        const {lang,plat_id,timezone,token,MarketType_area} = this.form;
        
        Http.post(net.HttpType.public_plat_config, {plat_id,timezone,lang}).then((response:any)=>{
            PlatConfig.config = response.data;
            GlobalVar.plat_id = plat_id?.toString() || "";
            GlobalVar.zone = timezone?.toString() || "";
            GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
            GlobalVar.MarketType_area = MarketType_area?.toString() || "";
            GlobalVar.lang = lang;
            const sTime = GlobalVar.server_time;
            this.nowtime=dateFormat(getDateByTimeZone(sTime * 1000 ,GlobalVar.zone) ,'yyyy-MM-dd');
            console.log("this.nowtime>>>",this.nowtime)
            const date1 = this.nowtime;
            const date2 = this.nowtime;
            this.myProxy.selectDate = [date1.toString(),date2.toString()]
            LangConfig.load(this.form.lang).then(()=>{
               this.isloadSecLang = true;
               this.myProxy.get_order_by_limit(0);
               GlobalVar.token = token;
             
            })

        })
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
    }
    onSelectDate(){
        this.bShowDateSelect = false;
        this.pageData.isActive = 1000;
        this.myProxy.get_order_selectdata(this.myProxy.selectDate);
    }
    @Watch("myProxy.selectDate")
    onWatchselectDate() {
        console.warn("selectDateselectDate>>"+this.myProxy.selectDate)
        const sel1 = this.myProxy.selectDate[0];
        const sel2 = this.myProxy.selectDate[1];
        if (sel1 && sel2 && Date.parse(sel1) > Date.parse(sel2)) {
            this.myProxy.selectDate = [sel2,sel1];
        }

    }
    onfresh(){
    
        this.myProxy.listQuery.page_count = 1;
        this.pageData.list = [];
        this.myProxy.api_user_orders();
        
    }
    onCopyOrder(order:any){
            CopyUtil(order);
            alert('复制成功')
    }
    get MarketType_area(){
        if (GlobalVar.MarketType_area == "1") {
            return LangUtil("亚洲盘")
        }else{
            return LangUtil("欧洲盘")
        }
    }
    getResultStr(win:any){
        if (win==0) {
            return LangUtil("平")
        }else if (win>0) {
            return LangUtil("赢")
        }else  {
            return LangUtil("输")
        }
    }
}
