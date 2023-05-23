import { generateUUID, parseLocaleNumber } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import Http from "@/core/Http";
import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { EventStatesVO } from "@/vo/EventStatesVO";
import { MarketFixVO, FixSelectionVO, MarketVO } from "@/vo/MarketVO";
import { MatchVO } from "@/vo/MatchVO";

export default class BetProxy extends puremvc.Proxy {
    static NAME = "BetProxy";

    private timeCount = 0;
    onRegister() {
        setInterval(() => {
            if (this.timeCount % 3 == 0) {
                this.api_market_typelist();
                this.api_event_states();
            }
            if (this.timeCount % 2 == 0) {
                if (!this.pageData.isShowResultPanel) {
                    this.api_user_pending();
                }
                for (const item of this.pageData.list) {
                    this.api_user_prebet(item.market.market_id, item.selection.id);
                }
            }
            if (this.pageData.isShowResultPanel) {
                this.api_user_pending();
            }
            this.timeCount++;
        }, 1000);
    }

    pageData = {
        loading: false,
        isShowResultPanel: false, // 投注结果页是否处于打开状态
        activeCount: 0,
        list: <
            {
                type: string;
                comp: CompetitionVO;
                matche: MatchVO;
                market: MarketFixVO;
                selection: FixSelectionVO;
                isMarketClose: boolean;
                oddsChance: boolean;
                maxStake: string;
                minStake: string;
                odds: string;
                oldOdds: string;
                unique: string;
                stake: string;
            }[]
        >[],
        /**盘口信息 */
        market_list: <MarketVO[]>[],
        /**赛事进程 */
        event_states: <EventStatesVO[]>[],
    };

    /**添加一个注单 */
    addItem(comp: CompetitionVO, matche: MatchVO, market: MarketFixVO, selection: FixSelectionVO, event_states: EventStatesVO[]) {
        if (!this.deleteItem(market.market_id, selection.id)) {
            this.pageData.list = [];
            this.pageData.list.push({
                type: "fix",
                comp: comp,
                matche: matche,
                market: market,
                selection: selection,
                isMarketClose: false,
                oddsChance: false,
                maxStake: "-",
                minStake: "-",
                odds: selection.price.back,
                oldOdds: "",
                unique: generateUUID(),
                stake: "",
            });
            this.pageData.activeCount++;
            this.pageData.event_states = event_states;
        }
    }
    /**删除一个注单 */
    deleteItem(market_id: any, selection_id: any): boolean {
        this.pageData.loading = false;
        const findIdx = this.pageData.list.findIndex((item) => item.selection.id == selection_id && item.market.market_id == market_id);
        if (findIdx >= 0) {
            this.pageData.list.splice(findIdx, 1);
            this.pageData.activeCount++;
            return true;
        }
        return false;
    }

    /**写入 待确认提示结果*/
    set_user_pending(data: any) {
        //TODO
    }
    /**盘口信息 写入*/
    set_market_typelist(data: any) {
        this.pageData.market_list = data;
    }
    /**赛事进程 写入*/
    set_event_states(data: any) {
        this.pageData.event_states = data;
    }
    /**预投注 */
    api_user_prebet(market_id: any, selection_id: any) {
        const findItem = this.pageData.list.find((item) => item.market.market_id == market_id && item.selection.id == selection_id);
        if (findItem) {
            const { matche, market, selection, odds } = findItem;
            const form: any = {};
            form.event_id = matche.id.toString();
            form.stake = "1";
            form.side = "Back";
            form.market_id = market.market_id;
            form.market_type = market.market_type;
            form.selection_id = selection.id.toString();
            form.odds = odds;
            Http.post(net.HttpType.api_user_prebet, form).then((response: any) => {
                if (matche && matche.id == form.event_id && market.market_id == form.market_id && selection.id == form.selection_id) {
                    if (response.status == 0) {
                        if (response.data.change == 1) {
                            if (response.data.newOdds) {
                                findItem.isMarketClose = false;
                                findItem.oddsChance = true;
                                findItem.oldOdds = findItem.odds;
                                findItem.odds = response.data.newOdds;
                            } else {
                                findItem.isMarketClose = true;
                            }
                        }
                        findItem.minStake = response.data.minStake;
                        findItem.maxStake = response.data.maxStake;
                    } else {
                        if (response.status == 1111006 || response.status == 1111021) {
                            findItem.isMarketClose = true;
                        }
                        if (response.status == 1111021 || response.status == 1111017 || response.status == 1111007) {
                            this.deleteItem(market_id, selection_id);
                        }
                    }
                }
            });
        }
    }
    /**投注 */
    api_user_betfix(market_id: any, selection_id: any, better_odds: number) {
        // GlobalVar.loading = true;
        this.pageData.loading = true;
        const findItem = this.pageData.list.find((item) => item.market.market_id == market_id && item.selection.id == selection_id);
        if (findItem) {
            const { stake, matche, market, selection, odds } = findItem;
            const form: any = {};
            form.event_id = matche.id.toString();
            form.stake = parseLocaleNumber(stake).toString();
            form.side = "Back";
            form.market_id = market.market_id;
            form.market_type = market.market_type;
            form.selection_id = selection.id.toString();
            form.odds = odds;
            form.better_odds = better_odds;
            this.sendNotification(net.HttpType.api_user_betfix, form);
        }
    }
    /**待确认提示结果 */
    api_user_pending() {
        this.sendNotification(net.HttpType.api_user_pending);
    }
    /**盘口接口-新*/
    api_market_typelist() {
        if (this.pageData.list.length > 0) {
            const form = {
                type: "fix",
                event_id: this.pageData.list.map((item) => item.matche.id),
                market_type: this.pageData.list.map((item) => item.market.market_type),
                unique: BetProxy.NAME,
            };
            this.sendNotification(net.HttpType.api_market_typelist, form);
        }
    }
    /**赛事进程*/
    api_event_states() {
        if (this.pageData.list.length > 0) {
            const event_ids = this.pageData.list.map((item) => item.matche.id);
            this.sendNotification(net.HttpType.api_event_states, { event_id: event_ids.toString(), unique: BetProxy.NAME });
        }
    }
}
