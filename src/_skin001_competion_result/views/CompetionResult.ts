import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import CompetionResultMediator from "../mediator/CompetionResultMediator";
import CompetionResultProxy from "../proxy/CompetionResultProxy";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import { getQueryVariable } from "@/core/global/Functions";
import { getResponseIcon, amountFormat, dateFormat, formatEventTime, getDateByTimeZone } from "@/core/global/Functions";

@Component
export default class PageOrderDetail extends AbstractView {
    LangUtil = LangUtil;
    dateFormat = dateFormat;
    getDateByTimeZone = getDateByTimeZone;
    getResponseIcon = getResponseIcon;
    myProxy: CompetionResultProxy = getProxy(CompetionResultProxy);
    pageData = this.myProxy.pageData;
    GlobalVar = GlobalVar;
    bShowDateSelect = false;
    nowtime = this.myProxy.nowtime;
    form = {
        lang: getQueryVariable("lang") || GlobalVar.lang || "zh_CN",
        plat_id: getQueryVariable("plat_id") || GlobalVar.plat_id,
        timezone: getQueryVariable("timezone") || GlobalVar.zone,
        sign: getQueryVariable("sign"),
        token: getQueryVariable("t") || GlobalVar.token || "",
    };
    constructor() {
        super(CompetionResultMediator);
    }

    mounted() {
        if (this.$vuetify.breakpoint.mobile) {
            // this.myProxy.init();
            this.myProxy.api_event_sports();
        } else {
            this.myProxy.api_public_plat_config();
        }
    }
    transTime(_t: any) {
        return dateFormat(getDateByTimeZone(_t * 1000, GlobalVar.zone), "hh:mm:ss");
    }
    onBack() {
        this.$router.back();
    }
    onSelectDate() {
        const menu: any = this.$refs.menu;
        menu.save(this.myProxy.selectDate);
        this.myProxy.api_event_result();
    }
    split_goals(goals: string) {
        const goalarr = goals.split("-");
        return goalarr; //LangUtil('全场得分')
    }
    get getSelectDate() {
        if (!this.myProxy.selectDate) return null;

        const [year, month, day] = this.myProxy.selectDate.split("-");
        return `${year}/${month}/${day}`;
    }
    openheard(ref: any, isopen: any) {
        const hearder: HTMLElement = <any>this.$refs[ref];
        if (isopen) {
            hearder.style.backgroundColor = "#ffff";
        }
    }
    onSportChange() {
        this.myProxy.listQuery.page_count = 1;
        this.pageData.competition_list = [];
        this.myProxy.init();
    }
    onfresh() {
        if (!this.myProxy.selectDate || !this.myProxy.selectDate[0] || !this.myProxy.selectDate[1]) {
            return;
        }
        this.myProxy.listQuery.page_count = 1;
        this.pageData.competition_list = [];
        this.myProxy.api_event_result();
    }
}
