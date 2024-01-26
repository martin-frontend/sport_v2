import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageRacingDetailMediator from "../mediator/PageRacingDetailMediator";
import PageRacingDetailProxy from "../proxy/PageRacingDetailProxy";
import LangUtil from "@/core/global/LangUtil";
import { dateFormat, formatURLParam, getDateByTimeZone, logEnterTips } from "@/core/global/Functions";
import Assets from "@/_skin001/assets/Assets";
import GlobalVar from "@/core/global/GlobalVar";
import getProxy from "@/core/global/getProxy";
import SelfProxy from "@/proxy/SelfProxy";
import OpenLink from "@/core/global/OpenLink";
import page_order from "../../page_order";
import matche from "../../matche";
import live from "../../live";
import right_panel from "../../right_panel";
import BlurUtil from "@/core/global/BlurUtil";
import AnimationEffect from "@/core/AnimationEffect";

@Component
export default class PageRacingDetail extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    myProxy: PageRacingDetailProxy = this.getProxy(PageRacingDetailProxy);
    pageData = this.myProxy.pageData;
    selectedItem = 0;
    sportIcon = Assets.SportIcon;
    mobileTopWindow = 0;
    mobileBottomWindow = 0;
    selfProxy: SelfProxy = getProxy(SelfProxy);
    user_type: number = this.selfProxy.userInfo.user_type;
    iframeHeight = 0;
    isShowMenu = false;

    get mobileTagOptions() {
        if (this.states?.match_phase == "DONE") {
            return ["race赛果", "投注盘"];
        }
        return ["投注盘"];
    }

    constructor() {
        super(PageRacingDetailMediator);
    }

    created() {
        if (!this.pageData.competitionId) {
            this.$router.push("/page_racing_home");
        }
        this.mobileBottomWindow = 0;
    }

    getResultStr(match_phase: string) {
        const type: any = {
            OPEN: "",
            DONE: "完成",
            INTERIM: "临时",
            ABANDONED: "放弃",
            FINAL: "最后",
            CLOSED: "关闭",
        };
        return LangUtil(type[match_phase]);
    }

    get curCompetition() {
        this.selectedItem = this.pageData.competition_list.findIndex((item: any) => {
            if (item.competition_id == this.pageData.competitionId) {
                const matches = Object.values(item.matches);
                return matches.findIndex((match: any) => match.id == this.myProxy.listQueryStates.event_id) > -1;
            }
            return false;
        });
        if (this.selectedItem > -1) {
            return this.pageData.competition_list[this.selectedItem];
        }
        return {};
    }

    get match() {
        return this.curCompetition.matches?.[this.pageData.matchKey];
    }

    /**进程 */
    get states() {
        return this.pageData.eventStatesByEventId[this.match?.id];
    }

    /**盘口 固陪*/
    get markets() {
        return this.pageData.marketListByEventId[this.match?.id]?.fix_markets;
    }

    getStartTime(start_time_timestamp: any) {
        return dateFormat(getDateByTimeZone(start_time_timestamp * 1000, <any>GlobalVar.zone), "hh:mm");
    }

    getEventDate(date: any) {
        return dateFormat(new Date(date), "MM/dd");
    }

    onTagClick(key: any) {
        this.pageData.loading = true;
        this.pageData.matchKey = key;
        const match = this.curCompetition.matches?.[key];
        this.myProxy.listQueryStates.event_id = match.id.toString();
        this.myProxy.getMarketAndStates();
        right_panel.show(1);
        right_panel.showLiveList(false);
        // matche.init(this.match.id);
        live.init(match.id, this.myProxy.listQueryComp.sport_id);
        this.myProxy.api_event_race_detail(match.id);
    }

    onChangeCompetion(index: any) {
        this.pageData.loading = true;
        const competition = this.pageData.competition_list[index];
        this.pageData.competitionId = competition.competition_id;
        this.pageData.matchKey = "R1";
        const match = competition.matches?.[this.pageData.matchKey];
        this.myProxy.listQueryStates.event_id = match.id.toString();
        this.myProxy.getMarketAndStates();
        right_panel.show(1);
        right_panel.showLiveList(false);
        // matche.init(this.pageData.competition_list[val].matches["R1"].id);
        live.init(match.id, this.myProxy.listQueryComp.sport_id);
        this.myProxy.api_event_race_detail(match.id);
    }

    onBack() {
        if (this.$vuetify.breakpoint.mobile) {
            //@ts-ignore
            AnimationEffect.pageCloseAnim(this.$refs.movediv.$el, () => {
                this.$router.push("/page_racing_home");
            });
        } else this.$router.push("/page_racing_home");
    }

    clicklive() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        this.mobileTopWindow = 1;
    }
    clickAnim() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        this.mobileTopWindow = 2;
    }

    // 打开注单历史
    onOrder() {
        if (this.user_type == 2) {
            logEnterTips();
            return;
        }
        page_order.show();
    }

    openHelp() {
        if (this.$vuetify.breakpoint.mobile) {
            this.$router.push("/page_help");
        } else {
            const dark = this.$vuetify.theme.dark;
            const params = formatURLParam({
                daynight_type: dark ? 2 : 1,
                plat_id: GlobalVar.plat_id,
                timezone: GlobalVar.zone,
            });
            const link = "./skin001_help.html?" + params;
            OpenLink(link);
        }
    }

    @Watch("$vuetify.breakpoint.width")
    onWatchWidth() {
        const divbox = this.$refs.divbox;
        const ifr: any = this.$refs.ifr;
        if (divbox && ifr) {
            //@ts-ignore
            this.iframeHeight = (divbox.$el.getBoundingClientRect().width * 290) / 400;
        }
    }

    @Watch("mobileTopWindow")
    onWatchWindow() {
        setTimeout(() => {
            this.onWatchWidth();
        }, 100);
    }

    mounted() {
        this.onWatchWidth();
        this.pageAnim();
    }

    @Watch("isShowMenu")
    onWatchShow(val: any) {
        if (this.$vuetify.breakpoint.mobile) {
            BlurUtil(val, "page-racing-detail", true);
        } else {
            BlurUtil(val, "page", true);
        }
    }

    destroyed() {
        super.destroyed();
    }
    pageAnim() {
        this.$nextTick(() => {
            if (this.$vuetify.breakpoint.mobile) {
                AnimationEffect.pageOpenAnim(this.$refs.movediv);
            }
        });
    }
}
