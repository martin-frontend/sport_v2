import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import HelpMediator from "../mediator/HelpMediator";
import HelpProxy from "../proxy/HelpProxy";
import LangUtil from "@/_skin001_help/core/config/LangUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { getQueryVariable } from "@/core/global/Functions";
import Http from "@/core/Http";
import net from "@/net/setting";
import PlatConfig from "@/core/config/PlatConfig";
import LangConfig from "../core/config/LangConfig";
import { watch } from "vue";
//import { marked } from "marked";

@Component
export default class Help extends AbstractView {
    LangUtil = LangUtil;
   // marked = marked;
    myProxy: HelpProxy = this.getProxy(HelpProxy);
    pageData = this.myProxy.pageData;
    isloadSecLang = false;
    showPanel = false;
    form = {
        lang: getQueryVariable("lang") || "zh_CN",
        order_id: getQueryVariable("order_id"),
        plat_id: getQueryVariable("plat_id"),
        timezone: getQueryVariable("timezone"),
        sign: getQueryVariable("sign"),
        token:getQueryVariable("t") || "",
    };
    oldSearchTxt = "";

    constructor() {
        super(HelpMediator);
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
            LangConfig.load(this.form.lang).then(()=>{
               this.isloadSecLang = true;
               this.myProxy.api_helpcenter_list();
               GlobalVar.token = token;
               this.onWatchHeight();
             
            })

        })
       
    }
    @Watch("pageData.searchTxt")
    onWatchSearch() {
        
        setTimeout(() => {
            this.replace("sub");
          this.oldSearchTxt = this.pageData.searchTxt;
        }, 50);
    }
    
    replace(tag: string) {
        
        const divScroll: HTMLElement = <any>this.$refs.divScroll;
        const arr = divScroll.querySelectorAll(tag);
        arr.forEach((item: any) => {
            if (this.oldSearchTxt) {
                item.innerHTML = item.innerText.replaceAll(
                    `<span style="background-color:rgb(27, 121, 242); color:white">${this.oldSearchTxt}</span>`,
                    this.oldSearchTxt
                );
            }
            if (this.pageData.searchTxt) {
                item.innerHTML = item.innerText.replaceAll(
                    this.pageData.searchTxt,
                    `<span style="background-color:rgb(27, 121, 242); color:white">${this.pageData.searchTxt}</span>`
                );
            }
        });
    }

    @Watch("$vuetify.breakpoint.height")
    onWatchHeight() {
        this.$nextTick(() => {
            const divScroll: HTMLElement = <any>this.$refs.divScroll;
            if (divScroll) {
                const height = document.body.clientHeight - divScroll.getBoundingClientRect().top;
                divScroll.style.height = height + "px";
                divScroll.style.maxHeight = height + "px";
                
            }
        });
    }

    @Watch("pageData.tabIndex")
    onWatchTabIndex() {
        switch (this.pageData.tabIndex) {
            case 1:
              
                break;
            case 2:
         
                break;
            case 3:
            
                break;
            case 4:
          
                break;
        }
        setTimeout(() => {
            this.onWatchSearch();
        }, 500);
    }
    
    setInsetHTML(id:any,content:any){
        const element: HTMLElement = <any>this.$refs.type1;
        if (element) {
            element.innerHTML=content;
        }
        
    }
    destroyed() {
        super.destroyed();
    }
}
