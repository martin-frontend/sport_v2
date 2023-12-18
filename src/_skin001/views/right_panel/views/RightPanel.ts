import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import RightPanelMediator from "../mediator/RightPanelMediator";
import RightPanelProxy from "../proxy/RightPanelProxy";
import LangUtil from "@/core/global/LangUtil";
import MatcheProxy from "../../matche/proxy/MatcheProxy";
import SelfProxy from "@/proxy/SelfProxy";
import getProxy from "@/core/global/getProxy";
import { dateFormat, logEnterTips } from "@/core/global/Functions";
import PageRacingDetailProxy from "../../page_racing_detail/proxy/PageRacingDetailProxy";
import SportUtil from "@/core/global/SportUtil";

@Component
export default class RightPanel extends AbstractView {
    LangUtil = LangUtil;
    matcheProxy: MatcheProxy = this.getProxy(MatcheProxy);
    racingDetailProxy: PageRacingDetailProxy = this.getProxy(PageRacingDetailProxy);
    myProxy: RightPanelProxy = this.getProxy(RightPanelProxy);
    pageData = this.myProxy.pageData;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    user_type!: number;
    isRaceEvent = SportUtil.isRaceEvent;
    constructor() {
        super(RightPanelMediator);
        const { user_type } = this.selfProxy.userInfo;
        this.user_type = user_type;
    }

    get competition() {
        return this.matcheProxy.pageData.competition_list[0];
    }
    get matche() {
        if (this.isRaceEvent(this.curSportId)) {
            const matche = this.competition?.matches[this.racingDetailProxy.pageData.matchKey];
            this.myProxy.isShowLive = !!matche?.animation_id;
            return matche;
        } else {
            return this.competition?.matches[0];
        }
    }

    get curSportId() {
        return this.matcheProxy.listQueryComp.sport_id;
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
    getEventDate(date: any) {
        return dateFormat(new Date(date), "MM/dd");
    }
    destroyed() {
        super.destroyed();
    }
    onClickShowTitle() {
        this.myProxy.isShowLive = !this.myProxy.isShowLive;
    }
}
