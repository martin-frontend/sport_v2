import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageHomeMediator from "../mediator/PageHomeMediator";
import PageHomeProxy from "../proxy/PageHomeProxy";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import { MatchVO } from "@/vo/MatchVO";
import page_home from "@/_skin001/views/page_home";
import GlobalVar from "@/core/global/GlobalVar";

@Component
export default class PageHome extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    settingProxy:SettingProxy = this.getProxy(SettingProxy);
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;

    constructor() {
        super(PageHomeMediator);
    }

    getTitleName(){
        const {country, competition_id, tag, keyword} = this.listQueryComp
        if(country){
            const findItem = this.pageData.menu_subnav.center.find((item) => item.country_code == country);
            if(findItem){
                return findItem.country_name;
            }
        }
        if(competition_id){
            if(this.pageData.competition_list.length > 0){
                return this.pageData.competition_list[0].competition_name;
            }
        }
        if(keyword){
            return LangUtil("搜索: ") + keyword;
        }
        if(tag == "love"){
            return LangUtil("关注赛事");
        }else{
            const findItem = this.pageData.menu_subnav.top.find((item) => item.tag == tag);
            if(findItem){
                return findItem.name;
            }
        }
        return "";
    }

    getTagNum(tag: string) {
        if (tag == "love") {
            return this.pageData.love_count;
        } else {
            const findItem = this.pageData.menu_subnav.top.find((item) => item.tag == tag);
            return findItem?.num;
        }
    }
    setAllLove(competition:any){
        const matches = competition.matches;
        let lovecount:number = 0;
        matches.forEach((item:any) => {
            if (this.pageData.love_events.indexOf(item.id)== -1) {
                lovecount++;
                this.myProxy.api_user_love(item.id);
            }
            
        });
        if (lovecount==0) {
            matches.forEach((item:any) => {
                this.myProxy.api_user_love(item.id);
            });
        }
    }
    /**检测是否整个联赛都关注了 */
    checkAllLove(competition:any){
        for(const item of competition.matches){
            if(this.pageData.love_events.indexOf(item.id) == -1){
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

    onQueryBetType(type: string) {
        this.listQueryComp.type = type;
        page_home.showEventList();
    }

    onQueryTagType(tag: string) {
        page_home.showByTag(tag);
    }

    onQuerySort(sort: string) {
        this.settingProxy.pageData.form.sort = sort;
        this.settingProxy.api_user_set_user_setting();
        this.listQueryComp.sort = sort;
        page_home.showEventList();
    }

    onQuery() {
        page_home.showEventList();
    }

    //搜寻
    onSearch() {
        page_home.showByKeyword(this.listQueryComp.keyword);
    }
    //刷新
    onRefrush(){
        page_home.showEventList();
    }

    destroyed() {
        super.destroyed();
    }
}
