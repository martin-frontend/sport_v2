import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import RightPanelMediator from "../mediator/RightPanelMediator";
import RightPanelProxy from "../proxy/RightPanelProxy";
import LangUtil from "@/core/global/LangUtil";
import MatcheProxy from "../../matche/proxy/MatcheProxy";
import SelfProxy from "@/proxy/SelfProxy";
import getProxy from "@/core/global/getProxy";
import { logEnterTips } from "@/core/global/Functions";

@Component
export default class RightPanel extends AbstractView {
    LangUtil = LangUtil;
    matcheProxy: MatcheProxy = this.getProxy(MatcheProxy);
    myProxy: RightPanelProxy = this.getProxy(RightPanelProxy);
    pageData = this.myProxy.pageData;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    user_type!: number;
    constructor() {
        super(RightPanelMediator);
        const { user_type } = this.selfProxy.userInfo;
        this.user_type = user_type;
    }

    get competition() {
        return this.matcheProxy.pageData.competition_list[0];
    }
    get matche() {
        return this.competition?.matches[0];
    }

    onLiveList() {
        this.pageData.isShowLiveList = !this.pageData.isShowLiveList;
    }
    clicklive() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        this.pageData.liveIndex = 1;
    }
    clickAnim() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        this.pageData.liveIndex = 2;
    }
    destroyed() {
        super.destroyed();
    }
}
