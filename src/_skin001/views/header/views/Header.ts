import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import HeaderMediator from "../mediator/HeaderMediator";
import HeaderProxy from "../proxy/HeaderProxy";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";

@Component
export default class Header extends AbstractView {
    LangUtil = LangUtil;
    settingProxy:SettingProxy = this.getProxy(SettingProxy);
    myProxy: HeaderProxy = this.getProxy(HeaderProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(HeaderMediator);
    }

    onMarketTypeArea(value:any){
        this.settingProxy.pageData.form.MarketType_area = value;
        this.settingProxy.api_user_set_user_setting();
    }

    onSettingSave(value:any){
        if(!value){
            this.settingProxy.api_user_set_user_setting();
        }
    }

    destroyed() {
        super.destroyed();
    }
}
