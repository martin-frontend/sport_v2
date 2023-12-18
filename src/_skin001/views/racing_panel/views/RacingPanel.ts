import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import RacingPanelMediator from "../mediator/RacingPanelMediator";
import RacingPanelProxy from "../proxy/RacingPanelProxy";
import LangUtil from "@/core/global/LangUtil";
import NavigationProxy from "../../navigation/proxy/NavigationProxy";
import SportUtil from "@/core/global/SportUtil";

@Component
export default class RacingPanel extends AbstractView {
    LangUtil = LangUtil;
    myProxy: RacingPanelProxy = this.getProxy(RacingPanelProxy);
    pageData = this.myProxy.pageData;
    tag = 0;
    sportCheckBoxArr = [`${this.myProxy.listQueryComp.sport_id}`];
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    isRaceEvent = SportUtil.isRaceEvent;

    sportCheckBoxOptions = {
        7: { title: "赛马", sportId: "7", icon: "race" },
        8: { title: "赛狗", sportId: "8", icon: "greyhound_racing" },
        9: { title: "马车赛", sportId: "9", icon: "harness_racing" },
    };

    get raceSportArr() {
        return this.navProxy.pageData.sportIdArr.filter((id) => this.isRaceEvent(id));
    }

    get tagOptions() {
        return ["下一场", "热门联赛"];
    }

    oldArrLength = 0;
    onCheckboxChange(val: any) {
        if (this.oldArrLength < val.length) {
            const lastVal = val[val.length - 1];
            // page_racing_home.showBySport(lastVal);
        }
        this.oldArrLength = val.length;
    }

    onTagClick(index: number) {
        this.tag = index;
    }

    constructor() {
        super(RacingPanelMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
