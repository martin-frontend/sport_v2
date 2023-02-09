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

@Component
export default class PageHome extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;

    constructor() {
        super(PageHomeMediator);
    }

    mounted() {
        const routerBox = document.getElementById("routerBox");
        this.$nextTick(() => {
            ScrollUtil(routerBox, this.pageData.scrollOffset, 0);
        });
    }

    /**关注整个联赛 */
    setAllLove(competition: any) {
        const matches = competition.matches;
        let lovecount: number = 0;
        matches.forEach((item: any) => {
            if (this.pageData.love_events.indexOf(item.id) == -1) {
                lovecount++;
                this.myProxy.api_user_love(item.id);
            }
        });
        if (lovecount == 0) {
            matches.forEach((item: any) => {
                this.myProxy.api_user_love(item.id);
            });
        }
    }
    /**检测是否整个联赛都关注了 */
    checkAllLove(competition: any) {
        for (const item of competition.matches) {
            if (this.pageData.love_events.indexOf(item.id) == -1) {
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
        } else {
            const findItem = this.pageData.menu_subnav.top.find((item) => item.tag == tag);
            return findItem?.num;
        }
    }

    onQuerySort(sort: string) {
        this.settingProxy.pageData.form.sort = sort;
        this.settingProxy.api_user_set_user_setting();
        this.listQueryComp.sort = sort;
        page_home.showEventList();
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
}
