import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageHomeMediator from "../mediator/PageHomeMediator";
import PageHomeProxy from "../proxy/PageHomeProxy";
import LangUtil from "@/core/global/LangUtil";
import { MatchVO } from "@/vo/MatchVO";
import GlobalVar from "@/core/global/GlobalVar";
import SettingProxy from "@/proxy/SettingProxy";
import page_home from "..";
import page_order from "../../page_order";
import dialog_setting from "../../dialog_setting";
import page_live_list from "../../page_live_list";
import ScrollUtil from "@/core/global/ScrollUtil";
import { CompetitionVO } from "@/vo/CompetitionVO";
import Assets from "@/_skin001/assets/Assets";
import NavigationProxy from "../../navigation/proxy/NavigationProxy";

@Component
export default class PageHome extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;
    sportIcon = Assets.SportIcon;
    tagIcon = Assets.TagIcon;

    constructor() {
        super(PageHomeMediator);
    }

    mounted() {
        const routerBox = document.getElementById("routerBox");
        this.$nextTick(() => {
            ScrollUtil(routerBox, this.pageData.scrollOffset, 0);
        });
    }

    get competition_list() {
        if (this.listQueryComp.tag == "today") {
            return this.myProxy.competition_list;
        } else {
            return this.pageData.competition_list;
        }
    }

    @Watch("settingProxy.pageData.form.todayEarly")
    onWatchTodayEarly() {
        if (this.listQueryComp.tag == "today") {
            this.$nextTick(() => {
                this.pageData.openIndexs = [0, 1, 2];
            });
        }
    }

    /**关注整个联赛 */
    setAllLove(competition: any) {
        const type = this.checkAllLove(competition);

        const matches = competition.matches;
        const len = matches.length;
        const events = [];
        for (let i = len - 1; i >= 0; i--) {
            if (!this.curSportNav?.favorite.events.includes(`${matches[i].id}`) || type) {
                events.push(matches[i].id);
            }
        }

        // 如果在关注页，直接删除该赛事
        if (this.listQueryComp.tag == "love") {
            const findIndex = this.pageData.competition_list.findIndex((item) => item.competition_id == competition.competition_id);
            this.pageData.competition_list.splice(findIndex, 1);
        }

        if (events.length == 0) return;
        this.myProxy.api_user_love(competition.competition_id, events);
    }

    /**检测是否整个联赛都关注了 */
    checkAllLove(competition: any) {
        for (const item of competition.matches) {
            if (this.curSportNav?.favorite?.events.indexOf(`${item.id}`) == -1) {
                return false;
            }
        }
        return true;
    }
    /**盘口 固陪*/
    getFixMarket(event_id: number) {
        const data = this.pageData.market_list.find((item) => item.event_id == event_id);
        return data?.fix_markets;
    }
    /**盘口 交易所*/
    getExMarket(event_id: number) {
        const data = this.pageData.market_list.find((item) => item.event_id == event_id);
        return data?.ex_markets;
    }
    /**进程 */
    getStates(event_id: number) {
        const data = this.pageData.event_states.find((item) => item.event_id == event_id);
        return data;
    }

    getSelections(matche: MatchVO, market_type: string) {
        const fixMarket: any = this.getFixMarket(matche.id);
        if (fixMarket) {
            const selections = fixMarket[matche.event_id][market_type].selections ?? [];
            return selections;
        }
        return [];
    }

    getTagNum(tag: string) {
        if (tag == "love") {
            return this.pageData.love_count;
        }
    }

    onQuerySort(sort: string) {
        this.settingProxy.pageData.form.sort = sort;
        this.settingProxy.api_user_set_user_setting();
        this.listQueryComp.sort = sort;
        page_home.showEventList();
    }
    sortname() {
        if (this.settingProxy.pageData.form.sort == "time") {
            return LangUtil("时间");
        } else {
            return LangUtil("联赛");
        }
    }

    //搜寻
    onSearch() {
        page_home.showByKeyword(this.listQueryComp.keyword);
    }

    onQueryTagType(tag: string) {
        page_home.showByTag(tag);
    }
    // 打开注单历史
    onOrder() {
        page_order.show();
    }
    // 打开设置页面
    onSetting() {
        dialog_setting.show();
    }
    // 打开热门直播页
    goLiveList() {
        page_live_list.show();
    }

    destroyed() {
        super.destroyed();
    }

    get new_menu_subnav() {
        return this.navProxy.pageData.new_menu_subnav;
    }

    get curSportNav() {
        return this.new_menu_subnav[this.listQueryComp.sport_id];
    }

    onFilter() {
        this.myProxy.pageData.isShowFilter = !this.myProxy.pageData.isShowFilter;
    }
}
