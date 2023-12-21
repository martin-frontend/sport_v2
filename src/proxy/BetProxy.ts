import Vue from "vue";
import { generateUUID, parseLocaleNumber } from "@/core/global/Functions";
import LangUtil from "@/core/global/LangUtil";
import Http from "@/core/Http";
import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { EventStatesVO } from "@/vo/EventStatesVO";
import { MarketFixVO, FixSelectionVO, MarketVO } from "@/vo/MarketVO";
import { MatchVO } from "@/vo/MatchVO";
import PlatConfig from "@/core/config/PlatConfig";
type BetType = "normal" | "single" | "parlay"; // normal: 单柱  single: 单场(批量) parlay: 串关

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
                // for (const item of this.pageData.list) {
                //     this.api_user_prebet(item.market.market_id, item.selection.id);
                // }
                if (this.pageData.list.length > 0) {
                    this.api_user_prebet_v3();
                }
            }
            if (this.pageData.isShowResultPanel) {
                this.api_user_pending();
            }
            this.timeCount++;
        }, 1000);
    }

    defaultParlayData = <any>{ maxStake: "", minStake: "", oldOdds: "", odds: "", oddsChange: false };

    pageData = {
        loading: false,
        isShowResultPanel: false, // 投注结果页是否处于打开状态
        activeCount: 0,
        list: <
            {
                type: string;
                comp: any;
                matche: MatchVO;
                market: MarketFixVO;
                selection: FixSelectionVO;
                isMarketClose: boolean;
                oddsChange: boolean;
                maxStake: string;
                minStake: string;
                odds: string;
                oldOdds: string;
                unique: string;
                stake: string;
                msg: string;
                leg_id: string;
            }[]
        >[],
        bettedList: <
            {
                type: string;
                comp: any;
                matche: MatchVO;
                market: MarketFixVO;
                selection: FixSelectionVO;
                isMarketClose: boolean;
                oddsChange: boolean;
                maxStake: string;
                minStake: string;
                odds: string;
                oldOdds: string;
                unique: string;
                stake: any;
                msg: string;
                leg_id: string;
            }[]
        >[],
        parlayData: { ...this.defaultParlayData },

        /**盘口信息 */
        market_list: <MarketVO[]>[],
        /**赛事进程 */
        event_states: <EventStatesVO[]>[],
        /**下注玩法 */
        betType: <BetType>"normal",
        /**是否可以添加同個Market */
        isCanAddSameMarket: false,
        /**前端自定义选项id，用来对应接口返回的数据 */
        listIdName: "leg",
        /**总投注额 */
        summaryStake: "",
        /**串关赔率 */
        parlayOdds: "",
        /**串关最大赔率 */
        maxParlayOdds: 500000,
        /**投注后还未跳转确认订单页时，继续下注 */
        isContinueBetting: false,
        /**是否在直播时下注 */
        isLive: false,
        /**最大下注数 */
        maxBetLength: 10,
    };

    /**添加一个注单 */
    addItem(comp: CompetitionVO, matche: MatchVO, market: MarketFixVO, selection: any, event_states: EventStatesVO[]) {
        if (!this.deleteItem(market.market_id, selection.id)) {
            // this.pageData.list = [];
            if (this.pageData.isLive) {
                this.initBetList();
            }

            if (this.pageData.list.length == this.pageData.maxBetLength) {
                Vue.notify({ group: "message", title: LangUtil("最多选择{0}场比赛", this.pageData.maxBetLength) });
                return;
            }
            this.pageData.list.push({
                type: "fix",
                comp: comp,
                matche: matche,
                market: market,
                selection: selection,
                isMarketClose: false,
                oddsChange: false,
                maxStake: "",
                minStake: "",
                odds: selection.price.back,
                oldOdds: "",
                unique: generateUUID(),
                stake: "",
                msg: "",
                leg_id: this.pageData.listIdName + this.pageData.activeCount,
            });
            if (this.pageData.betType == "parlay") {
                this.initBetList(true);
            } else {
                this.setBetType();
                this.pageData.activeCount++;
            }
            this.pageData.event_states = event_states;
        }
    }
    /**删除一个注单 */
    deleteItem(market_id: any, selection_id: any): boolean {
        // this.pageData.loading = false;
        if (!this.pageData.isCanAddSameMarket) {
            const findIdx = this.pageData.list.findIndex((item) => item.market.market_id == market_id);
            if (findIdx >= 0) {
                const item = this.pageData.list.splice(findIdx, 1);
                this.pageData.activeCount++;
                if (item[0].selection.id == selection_id) {
                    this.setBetType();
                    if (this.pageData.betType == "parlay") {
                        this.initBetList(true);
                    }
                    return true;
                }
            }
        } else {
            const findIdx = this.pageData.list.findIndex((item) => item.selection.id == selection_id && item.market.market_id == market_id);
            if (findIdx >= 0) {
                this.pageData.list.splice(findIdx, 1);
                this.pageData.activeCount++;
                this.setBetType();
                return true;
            }
        }
        return false;
    }

    setBetType() {
        if (this.pageData.list.length > 1 && this.pageData.betType === "normal") {
            this.pageData.betType = PlatConfig.config.client.isDefaultParlay == 1 ? "parlay" : "single";
        } else if (this.pageData.list.length == 1) {
            this.pageData.betType = "normal";
        }
    }

    /**删除全部注单或初始化stake */
    initBetList(isHold: any = false) {
        // this.pageData.loading = false;
        this.pageData.summaryStake = "";
        Object.assign(this.pageData.parlayData, { ...this.defaultParlayData });
        if (!isHold) {
            this.pageData.list.splice(0, this.pageData.list.length);
        } else {
            this.pageData.list.forEach((item) => {
                item.stake = "";
                item.oddsChange = false;
            });
        }
        this.pageData.activeCount++;
        this.setBetType();
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
                                findItem.oddsChange = true;
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
    /**预投注v3 新 */
    api_user_prebet_v3() {
        // const { matche, market, selection, odds } = findItem;
        const form: any = {};
        form.is_multiple = this.pageData.betType != "parlay" ? 0 : 1;
        form.multi_odds = 1;
        form.bet_list = this.pageData.list.map((item, index) => {
            return {
                // leg_id: this.pageData.listIdName + index,
                leg_id: item.leg_id,
                event_id: item.matche.id.toString(),
                market_id: item.market.market_id,
                market_type: item.market.market_type,
                selection_id: item.selection.id.toString(),
                odds: item.odds,
                stake: 1,
                side: "Back",
                sport_id: item.comp.sport_id,
            };
        });
        if (form.is_multiple == 1) {
            form.multi_odds = `${this.pageData.parlayOdds}`;
        }
        Http.post(net.HttpType.api_user_prebet_v3, form).then((response: any) => {
            if (response.status == 0) {
                // 单关、单场
                if (form.is_multiple == 0) {
                    Object.keys(response.data).forEach((key) => {
                        const { data, code, msg } = response.data[key];
                        // const index = key.replace(this.pageData.listIdName, "");
                        const findItem = this.pageData.list.find((item) => item.leg_id == key);
                        if (!findItem) return;
                        findItem.msg = "";
                        if (code === 0 && data) {
                            findItem.minStake = data.minStake;
                            findItem.maxStake = data.maxStake;
                            if (data.change == 1) {
                                if (data.newOdds) {
                                    findItem.isMarketClose = false;
                                    findItem.oddsChange = true;
                                    findItem.oldOdds = findItem.odds;
                                    findItem.odds = data.newOdds;
                                } else {
                                    findItem.isMarketClose = true;
                                }
                            }
                        } else {
                            this.deleteItem(findItem.market.market_id, findItem.selection.id);
                        }
                    });
                }
                // 串关
                else {
                    // if (response.data.change == 1 || !this.pageData.parlayData.odds) {
                    const { maxStake, minStake, newOdds, odds } = response.data;
                    Object.assign(this.pageData.parlayData, {
                        maxStake,
                        minStake,
                        oldOdds: odds,
                        // odds: newOdds,
                        odds: form.multi_odds,
                    });
                    if (response.data.change == 1) {
                        this.pageData.parlayData.oddsChange = true;
                    }
                    // }
                    Object.keys(response.data.legs).forEach((key) => {
                        const { data, code, msg } = response.data.legs[key];
                        // const index = key.replace(this.pageData.listIdName, "");
                        const findItem = this.pageData.list.find((item) => item.leg_id == key);
                        if (!findItem) return;
                        findItem.msg = "";
                        if (code === 0 && data) {
                            findItem.minStake = data.minStake;
                            findItem.maxStake = data.maxStake;
                            if (data.change == 1) {
                                if (data.newOdds) {
                                    findItem.isMarketClose = false;
                                    findItem.oddsChange = true;
                                    findItem.oldOdds = findItem.odds;
                                    findItem.odds = data.newOdds;
                                } else {
                                    findItem.isMarketClose = true;
                                }
                            }
                        } else {
                            findItem.msg = msg;
                        }
                    });
                }
            } else {
                this.initBetList();
            }
        });
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
            form.priceIndex = selection.priceIndex;
            form.odds = odds;
            form.better_odds = better_odds;
            this.sendNotification(net.HttpType.api_user_betfix, form);
        }
    }
    /**投注v3 新 */
    api_user_betfix_v3(total_stake: any, better_odds: any) {
        // GlobalVar.loading = true;
        this.pageData.loading = true;
        this.pageData.isContinueBetting = false;
        this.pageData.bettedList = JSON.parse(JSON.stringify(this.pageData.list));
        const bet_type = this.pageData.betType == "parlay" ? "multi" : "single";
        const form: any = {
            total_stake,
            better_odds,
            bet_type,
        };
        if (bet_type == "multi") {
            form.multi_odds = `${this.pageData.parlayOdds}`;
        }
        form.bet_list = [];
        this.pageData.bettedList.forEach((item) => {
            if (item.stake == "" || item.stake == ".") return;
            item.stake = Number(parseLocaleNumber(item.stake));
            const query: any = {
                leg_id: item.leg_id,
                event_id: item.matche.id.toString(),
                market_id: item.market.market_id,
                market_type: item.market.market_type,
                selection_id: item.selection.id.toString(),
                odds: item.odds,
                stake: item.stake,
                // stake: null,
                side: "Back",
                price_index: item.selection.priceIndex?.toString() || "0",
                sport_id: item.comp.sport_id,
            };
            if (bet_type == "multi") {
                delete query.stake;
            }
            form.bet_list.push(query);
        });
        this.sendNotification(net.HttpType.api_user_betfix_v3, form);
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
                event_id: this.pageData.list.map((item) => item.matche.id).toString(),
                market_type: this.pageData.list.map((item) => item.market.market_type).toString(),
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
