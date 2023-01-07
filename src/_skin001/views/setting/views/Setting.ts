import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import SettingMediator from "../mediator/SettingMediator";
import SettingProxy from "../proxy/SettingProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class Setting extends AbstractView {
    LangUtil = LangUtil;
    myProxy: SettingProxy = this.getProxy(SettingProxy);
    pageData = this.myProxy.pageData;

    radioGroup = 0;

    constructor() {
        super(SettingMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
