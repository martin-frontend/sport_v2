import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import LangUtil from "@/_skin001_history_result/core/config/LangUtil";
import historyResultMediator from "../mediator/historyResultMediator";
import historyResultProxy from "../proxy/historyResultProxy";
import Http from "@/core/Http";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import PlatConfig from "@/core/config/PlatConfig";
import GlobalVar from "@/core/global/GlobalVar";
import LangConfig from "../core/config/LangConfig";
import { getQueryVariable } from "@/core/global/Functions";
import OrderTitleUtils from "@/_skin001_history_result/core/config/OrderTitleUtils";
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
    isloadSecLang = false;
    bShowDateSelect= false;
    SelectDate1 = "";
    SelectDate2 = "";
    nowtime :any;
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
    };
    //根据盘口展示已结算的赛果角球还是比分等
    getHadResultStr(item: any){
        const copyitem = JSON.parse(JSON.stringify(item));
        copyitem.state = copyitem.real_time_state;

        return this.getScoreStr(copyitem);
    }
    mounted() {
        
        
        const {lang,plat_id,timezone,token} = this.form;
        
        Http.post(net.HttpType.public_plat_config, {plat_id,timezone,lang}).then((response:any)=>{
            PlatConfig.config = response.data;
            GlobalVar.plat_id = plat_id?.toString() || "";
            GlobalVar.zone = timezone?.toString() || "";
            GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
            GlobalVar.lang = lang;
            const sTime = GlobalVar.server_time;
            this.nowtime=dateFormat(getDateByTimeZone(sTime * 1000 ,GlobalVar.zone) ,'yyyy/MM/dd');
            console.log("this.nowtime>>>",this.nowtime)
            const date1 = this.nowtime;
            const date2 = this.nowtime;
            this.myProxy.selectDate = [date1.toString(),date2.toString()]
            LangConfig.load(this.form.lang).then(()=>{
               this.isloadSecLang = true;
               this.myProxy.get_order_by_limit(0);
               GlobalVar.token = token;
               // 注单状态
                this.statusMap = {
                    0: LangUtil("确认中"), //确认中
                    1: LangUtil("确认成功"), //确认成功
                    3: LangUtil("已拒绝"), //拒绝
                    4: LangUtil("已取消"), //拒绝
                    5: LangUtil("无效"), //无效
                };
             
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
    
//获取比分说明 是角球点球还是比分等
getScoreStr(item:any){
    const cornersMarket_type = [marketType.CR_ASIAN_HANDICAP,marketType.CR_ASIAN_OVER_UNDER];//角球
    const addtimeHalfMarket_type = [marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME,marketType.ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME];//半场加时
    const addtimeMarket_type = [marketType.ASIAN_HANDICAP_EXTRA_TIME ,marketType.ASIAN_OVER_UNDER_EXTRA_TIME];//全场加时
    const AFTER_Market_type = [marketType.ASIAN_HANDICAP_AFTER_PENALTIES,marketType.ASIAN_OVER_UNDER_AFTER_PENALTIES];//点球
    const firstHalfarr = [marketType.EITHER_TEAM_TO_SCORE_HALF_TIME, marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME,marketType.ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME, marketType.DOUBLE_CHANCE_HALF_TIME, marketType.MATCH_ODDS_HALF_TIME,marketType.TOTAL_GOALS_HALF_TIME,marketType.ASIAN_OVER_UNDER_HALF_TIME,marketType.ASIAN_HANDICAP_HALF_TIME,marketType.DRAW_NO_BET_HALF_TIME,marketType.BOTH_TEAMS_TO_SCORE_HALF_TIME,marketType.TEAM_A_WIN_TO_NIL_HALF_TIME,marketType.TEAM_B_WIN_TO_NIL_HALF_TIME,marketType.ODD_OR_EVEN_HALF_TIME,marketType.CORRECT_SCORE_HALF_TIME];
    const state = Object.keys(item.state || {}).length > 0  ? item.state : item.real_time_state ? item.real_time_state : item.state;
    if (!state) {
        return "";
    }
    if (cornersMarket_type.indexOf(item.market_type) != -1) {
        if (!state.corners_ft) return "";
        return " "+LangUtil("角球")+"("+state.corners_ft+")";
    }else if (addtimeHalfMarket_type.indexOf(item.market_type) != -1) {
        if (!state.goals_otht) return "";
        return " "+LangUtil("半场加时")+"("+state.goals_otht+")";
    }else if (addtimeMarket_type.indexOf(item.market_type) != -1) {
        if (!state.goals_ot) return "";
        return " "+LangUtil("加时")+"("+state.goals_ot+")";
    }else if (AFTER_Market_type.indexOf(item.market_type) != -1) {
        if (!state.goals_pk) return "";
        return " "+LangUtil("点球")+"("+state.goals_pk+")";
    }else if (firstHalfarr.indexOf(item.market_type) != -1) {
        if (!state.goals_ht) return "";
        return " "+LangUtil("半场比分")+"("+state.goals_ht+")";
    }
    else {
        if (!state.goals_ft) return "";
        return " "+LangUtil("比分")+"("+state.goals_ft+")";
    }
}
}
