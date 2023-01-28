import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageHomeMediator from "../mediator/PageHomeMediator";
import PageHomeProxy from "../proxy/PageHomeProxy";
import LangUtil from "@/core/global/LangUtil";
import { MatchVO } from "@/vo/MatchVO";
import GlobalVar from "@/core/global/GlobalVar";

@Component
export default class PageHome extends AbstractView {
    LangUtil = LangUtil;
    GlobalVar = GlobalVar;
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(PageHomeMediator);
        GlobalVar.loading1 = true;
    }
    /**关注整个联赛 */
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

    destroyed() {
        super.destroyed();
    }
}
