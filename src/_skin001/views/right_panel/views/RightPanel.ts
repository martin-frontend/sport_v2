import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import RightPanelMediator from "../mediator/RightPanelMediator";
import RightPanelProxy from "../proxy/RightPanelProxy";
import LangUtil from "@/core/global/LangUtil";
import SelfProxy from "@/proxy/SelfProxy";
import getProxy from "@/core/global/getProxy";
import { dateFormat, logEnterTips } from "@/core/global/Functions";
import PageRacingDetailProxy from "../../page_racing_detail/proxy/PageRacingDetailProxy";
import SportUtil from "@/core/global/SportUtil";
import LiveProxy from "../../live/proxy/LiveProxy";
import live_list from "../../live_list";
import PageHomeProxy from "../../page_home/proxy/PageHomeProxy";
import right_panel from "..";

@Component
export default class RightPanel extends AbstractView {
    LangUtil = LangUtil;
    liveProxy: LiveProxy = this.getProxy(LiveProxy);
    racingDetailProxy: PageRacingDetailProxy = this.getProxy(PageRacingDetailProxy);
    myProxy: RightPanelProxy = this.getProxy(RightPanelProxy);
    homeProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
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
        return this.liveProxy.pageData.competition_list[0];
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
        return this.liveProxy.listQueryComp.sport_id;
    }

    onLiveList() {
        this.pageData.isShowLiveList = !this.pageData.isShowLiveList;
        if (this.pageData.isShowLiveList) {
            live_list.show();
        }
    }
    clicklive() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        this.pageData.liveIndex = 1;
        this.myProxy.isShowLive = true;
    }
    clickAnim() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        this.pageData.liveIndex = 2;
        this.myProxy.isShowLive = true;
    }
    getEventDate(date: any) {
        return dateFormat(new Date(date), "MM/dd");
    }

    @Watch("homeProxy.listQueryComp.sport_id")
    onWatchSportId() {
        right_panel.showLiveList(false);
        right_panel.show(0);
    }

    @Watch("homeProxy.listQueryComp.tag")
    onWatchTag() {
        right_panel.showLiveList(false);
        right_panel.show(0);
    }

    destroyed() {
        super.destroyed();
    }
    onClickShowTitle() {
        this.myProxy.isShowLive = !this.myProxy.isShowLive;
    }
}
