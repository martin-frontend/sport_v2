import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import RightPanelMediator from "../mediator/RightPanelMediator";
import RightPanelProxy from "../proxy/RightPanelProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class RightPanel extends AbstractView {
    LangUtil = LangUtil;
    myProxy: RightPanelProxy = this.getProxy(RightPanelProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(RightPanelMediator);
    }

    onLiveList(){
        this.pageData.isShowLiveList = !this.pageData.isShowLiveList;
    }

    destroyed() {
        super.destroyed();
    }
}
