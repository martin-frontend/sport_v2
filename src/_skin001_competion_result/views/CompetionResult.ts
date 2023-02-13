import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import LangUtil from "@/_skin001_competion_result/core/config/LangUtil";
import CompetionResultMediator from "../mediator/CompetionResultMediator";
import CompetionResultProxy from "../proxy/CompetionResultProxy";
import Http from "@/core/Http";
import getProxy from "@/core/global/getProxy";
import net from "@/net/setting";
import PlatConfig from "@/core/config/PlatConfig";
import GlobalVar from "@/core/global/GlobalVar";
import LangConfig from "../core/config/LangConfig";
import { getQueryVariable } from "@/core/global/Functions";
import { getResponseIcon, amountFormat, dateFormat, formatEventTime, getDateByTimeZone } from "@/core/global/Functions";

@Component
export default class PageOrderDetail extends AbstractView{
    LangUtil = LangUtil;
    dateFormat =dateFormat;
    getDateByTimeZone=getDateByTimeZone;
    getResponseIcon = getResponseIcon;
    myProxy: CompetionResultProxy = getProxy(CompetionResultProxy);
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
    };
    constructor() {
        super(CompetionResultMediator);
    }

    mounted() {
        
        
        const {lang,plat_id,timezone,token} = this.form;
        
        Http.post(net.HttpType.public_plat_config, {plat_id,timezone,lang}).then((response:any)=>{
            PlatConfig.config = response.data;
            GlobalVar.plat_id = plat_id?.toString() || "";
            GlobalVar.zone = timezone?.toString() || "";
            GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
            GlobalVar.lang = lang;
            GlobalVar.token = token;
            const sTime = GlobalVar.server_time;
            this.myProxy.selectDate=dateFormat(getDateByTimeZone(sTime * 1000 ,GlobalVar.zone) ,'yyyy-MM-dd');
            this.nowtime = this.myProxy.selectDate
            LangConfig.load(this.form.lang).then(()=>{
               this.isloadSecLang = true;
               
               this.myProxy.init();
               
             
            })

        })
    }
    transTime(_t: any) {
        return dateFormat(getDateByTimeZone(_t * 1000, GlobalVar.zone), "hh:mm:ss");
    }
    onSelectDate(){
        const menu: any = this.$refs.menu;
        menu.save(this.myProxy.selectDate)
        this.myProxy.init();
    }
    split_goals(goals: string) {
        const goalarr = goals.split("-");
        return goalarr; //LangUtil('全场得分')
    }
    get getSelectDate(){
        if (!this.myProxy.selectDate) return null

        const [year, month, day] = this.myProxy.selectDate.split('-')
        return `${year}/${month}/${day}`
    }
    openheard(ref:any,isopen:any){
        const hearder:HTMLElement = <any>this.$refs[ref]
        if (isopen) {
            hearder.style.backgroundColor='#ffff'
        }
    }
}
