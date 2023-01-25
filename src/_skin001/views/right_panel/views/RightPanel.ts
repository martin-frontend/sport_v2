import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import RightPanelMediator from "../mediator/RightPanelMediator";
import RightPanelProxy from "../proxy/RightPanelProxy";
import LangUtil from "@/core/global/LangUtil";
import MatcheProxy from "../../matche/proxy/MatcheProxy";

@Component
export default class RightPanel extends AbstractView {
    LangUtil = LangUtil;
    matcheProxy:MatcheProxy = this.getProxy(MatcheProxy);
    myProxy: RightPanelProxy = this.getProxy(RightPanelProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(RightPanelMediator);
    }

    get competition(){
        return this.matcheProxy.pageData.competition_list[0];
    }
    get matche(){
        return this.competition?.matches[0];
    }

    onLiveList(){
        this.pageData.isShowLiveList = !this.pageData.isShowLiveList;
    }

    destroyed() {
        super.destroyed();
    }
}
