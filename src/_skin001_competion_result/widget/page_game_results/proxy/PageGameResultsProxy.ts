import net from "@/net/setting";
import { EventStatesVO } from "@/vo/EventStatesVO";
import PlatConfig from "@/core/config/PlatConfig";
import LangUtil from "@/core/global/LangUtil";
import { objectRemoveNull } from "@/core/global/Functions";
import { MarketVO } from "@/vo/MarketVO";
import GlobalVar from "@/core/global/GlobalVar";

export default class PageGameResultsProxy extends puremvc.Proxy {
    static NAME = "PageGameResultsProxy";
    public onRegister(): void {
        this.updateMarketTypeOptions();
        // TODO 请求初始数据
    }
    
    pageData = {
        competitionName: "",
        /**赛事进程 */
        event_states: <EventStatesVO[]>[],
        matche: {
            animation_id: "",
            away_team: "",
            away_team_icon_url: "",
            competition_id: "",
            event_id: "",
            goals_ft: "",
            home_team: "",
            home_team_icon_url: "",
            id: "",
            sb_time: "",
            start_time: "",
        },
        isActive: 1,
        animationType: 0,
        loading: false,
        marketType: <any>[],
        selectedMarketType: <any>[],
    };
    listQueryMarket = {
        type: "fix",
        event_id: "",
        market_type: 0,
        unique: "result",
    };

    //模板分类
    marketTypeKind = [
        { market_type: 'MATCH_ODDS', name: LangUtil("主客和"), type: "FT", category: <any>[0], result: "" },
        { market_type: 'ASIAN_HANDICAP', name: LangUtil("亚洲让球盘"), type: "FT", category: [0], result: "" },
        { market_type: 'ASIAN_OVER_UNDER', name: LangUtil("亚洲大小盘"), type: "FT", category: [0], result: "" },
        { market_type: 'TOTAL_GOALS', name: LangUtil("总入球"), type: "FT", category: [0], result: 0 },
        { market_type: 'CR_ASIAN_OVER_UNDER', name: LangUtil("亚洲大小盘 - 角球"), type: "FT", category: [0], result: "" },
        { market_type: 'CR_ASIAN_HANDICAP', name: LangUtil("亚洲让球盘 - 角球"), type: "FT", category: [0], result: "" },
        { market_type: 'DRAW_NO_BET', name: LangUtil("平局退款"), type: "FT", category: [0], result: "" },
        { market_type: 'BOTH_TEAMS_TO_SCORE', name: LangUtil("两队都得分"), type: "FT", category: [0], result: "" },
        { market_type: 'MATCH_ODDS_HALF_TIME', name: LangUtil("半场 - 主客和"), type: "FT", category: [0], result: "" },
        { market_type: 'HALF_TIME_FULL_TIME', name: LangUtil("半场/全场"), type: "FT", category: [0], result: "" },
        { market_type: 'CORRECT_SCORE', name: LangUtil("波胆"), type: "FT", category: [0], result: "" },
        { market_type: 'DOUBLE_CHANCE', name: LangUtil("双重机会/双胜彩"), type: "FT", category: [0], result: "" },
        { market_type: 'TEAM_A_WIN_TO_NIL', name: LangUtil("主队零失球获胜"), type: "FT", category: [0], result: "" },
        { market_type: 'TEAM_B_WIN_TO_NIL', name: LangUtil("客队零失球获胜"), type: "FT", category: [0], result: "" },
        { market_type: 'ODD_OR_EVEN', name: LangUtil("入球单双"), type: "FT", category: [0], result: "" },
        { market_type: 'ASIAN_HANDICAP_HALF_TIME', name: LangUtil("半场 - 亚洲让球盘"), type: "FT", category: [0], result: "" },
        { market_type: 'DRAW_NO_BET_HALF_TIME', name: LangUtil("半场 - 平局退款"), type: "FT", category: [0], result: "" },
        { market_type: 'ASIAN_OVER_UNDER_HALF_TIME', name: LangUtil("半场 - 亚洲大小盘"), type: "FT", category: [0], result: "" },
        { market_type: 'TOTAL_GOALS_HALF_TIME', name: LangUtil("半场 - 总入球"), type: "FT", category: [0], result: "" },
        { market_type: 'DOUBLE_CHANCE_HALF_TIME', name: LangUtil("半场 - 双重机会/双胜彩"), type: "FT", category: [0], result: "" },
        { market_type: 'TEAM_A_WIN_TO_NIL_HALF_TIME', name: LangUtil("半场 - 主队零失球获胜"), type: "FT", category: [0], result: "" },
        { market_type: 'TEAM_B_WIN_TO_NIL_HALF_TIME', name: LangUtil("半场 - 客队零失球获胜"), type: "FT", category: [0], result: "" },
        { market_type: 'ODD_OR_EVEN_HALF_TIME', name: LangUtil("半场 - 单/双"), type: "FT", category: [0], result: "" },
        { market_type: 'BOTH_TEAMS_TO_SCORE_HALF_TIME', name: LangUtil("半场 - 两队都得分"), type: "FT", category: [0], result: "" },
        { market_type: 'CORRECT_SCORE_HALF_TIME', name: LangUtil("半场 - 波胆"), type: "FT", category: [0], result: "" },
        { market_type: 'ASIAN_HANDICAP_EXTRA_TIME', name: LangUtil("亚洲让球盘 - 全场加时"), type: "OT", category: [0], result: "" },
        { market_type: 'ASIAN_OVER_UNDER_EXTRA_TIME', name: LangUtil("亚洲大小盘 - 全场加时"), type: "OT", category: [0], result: "" },
        { market_type: 'ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME', name: LangUtil("亚洲让球盘 - 半场加时"), type: "OT", category: [0], result: "" },
        { market_type: 'ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME', name: LangUtil("亚洲大小盘 - 半场加时"), type: "OT", category: [0], result: "" },
        { market_type: 'ASIAN_HANDICAP_AFTER_PENALTIES', name: LangUtil("亚洲让球盘 - 加时后罚十二码"), type: "PK", category: [0], result: "" },
        { market_type: 'ASIAN_OVER_UNDER_AFTER_PENALTIES', name: LangUtil("亚洲大小盘 - 加时后罚十二码"), type: "PK", category: [0], result: "" },
    ]

    marketTypeOptions: any[] = [];

    updateMarketTypeOptions() {
        const arr = [{ id: 0, name: LangUtil("所有") }];
        arr.push(...PlatConfig.market_main_type);
        for (const item of this.marketTypeKind) {
            const type = PlatConfig.allMarketType.filter(el => el.market_type == item.market_type)
            item.category.push(...type[0].main_type.split(',').map(function (x) {
                return parseInt(x);
            }))
        }
        this.marketTypeOptions = arr;
    }

    /**赛事进程 写入*/
    set_api_event_states(data: any) {
        this.pageData.event_states = [];
        this.pageData.event_states.push(data[0]);
        this.set_results(this.pageData.event_states[0]);
        if (["PK", "PK FT"].includes(this.pageData.event_states[0].match_phase)) {
            //全部盘口
            this.pageData.marketType.push(...this.marketTypeKind);
            this.pageData.selectedMarketType.push(...this.marketTypeKind);
        } else if (["1H OT", "OT HT", "2H OT", "OT FT"].includes(this.pageData.event_states[0].match_phase)) {
            //加时盘口
            this.pageData.marketType.push(...this.marketTypeKind.filter(el => el.type == "FT" || el.type == "OT"));
            this.pageData.selectedMarketType.push(...this.marketTypeKind.filter(el => el.type == "FT" || el.type == "OT"));
        } else {
            //正规盘口
            this.pageData.marketType.push(...this.marketTypeKind.filter(el => el.type == "FT"));
            this.pageData.selectedMarketType.push(...this.marketTypeKind.filter(el => el.type == "FT"));
        }
     
    }

    set_results(data: any) {
        // 全场 - 主客和 平局退款 双重机会/双胜彩
        if (data.goals_ft.split("-")[0] > data.goals_ft.split("-")[1]) {
            this.marketTypeKind[0].result = this.marketTypeKind[6].result = this.marketTypeKind[11].result = this.pageData.matche.home_team;
        } else if (data.goals_ft.split("-")[0] == data.goals_ft.split("-")[1]) {
            this.marketTypeKind[0].result = this.marketTypeKind[6].result = this.marketTypeKind[11].result = LangUtil("和");
        } else {
            this.marketTypeKind[0].result = this.marketTypeKind[6].result = this.marketTypeKind[11].result = this.pageData.matche.away_team;
        }
        // 全场 - 亚洲让球盘, 波胆 
        this.marketTypeKind[1].result = this.marketTypeKind[10].result = data.goals_ft;
        // 全场 - 总入球, 亚洲大小盘
        this.marketTypeKind[2].result = this.marketTypeKind[3].result = parseInt(data.goals_ft.split("-")[0]) + parseInt(data.goals_ft.split("-")[1]);
        // 全场 - 亚洲大小盘 - 角球
        this.marketTypeKind[4].result = parseInt(data.corners_ft.split("-")[0]) + parseInt(data.corners_ft.split("-")[1]);
        // 全场 - 亚洲让球盘 - 角球
        this.marketTypeKind[5].result = data.corners_ft;
        // 两队都得分
        this.marketTypeKind[7].result = (data.goals_ft.split("-")[0] > 0 && data.goals_ft.split("-")[1] > 0) ? LangUtil("是") : LangUtil("否");
        // 半场 - 主客和, 平局退款, 双重机会/双胜彩, 
        if (data.goals_ht.split("-")[0] > data.goals_ht.split("-")[1]) {
            this.marketTypeKind[8].result = this.marketTypeKind[16].result = this.marketTypeKind[19].result = this.pageData.matche.home_team;
        } else if (data.goals_ft.split("-")[0] == data.goals_ft.split("-")[1]) {
            this.marketTypeKind[8].result = this.marketTypeKind[16].result = this.marketTypeKind[19].result = LangUtil("和");
        } else {
            this.marketTypeKind[8].result = this.marketTypeKind[16].result = this.marketTypeKind[19].result = this.pageData.matche.away_team;
        }
        // 半场/全场
        this.marketTypeKind[9].result = this.marketTypeKind[8].result + '-' + this.marketTypeKind[0].result;
        // 主队零失球获胜
        this.marketTypeKind[12].result = ((data.goals_ft.split("-")[0] > data.goals_ft.split("-")[1]) && data.goals_ft.split("-")[1] == 0) ? LangUtil("是") : LangUtil("否");
        // 客队零失球获胜
        this.marketTypeKind[13].result = ((data.goals_ft.split("-")[0] < data.goals_ft.split("-")[1]) && data.goals_ft.split("-")[0] == 0) ? LangUtil("是") : LangUtil("否");
        // 入球单双
        this.marketTypeKind[14].result = (parseInt(data.goals_ft.split("-")[0]) + parseInt(data.goals_ft.split("-")[1])) % 2 == 0 ? LangUtil("双") : LangUtil("单");
        // 半场 - 波胆
        this.marketTypeKind[15].result = this.marketTypeKind[24].result = data.goals_ht;
        // 半场 - 亚洲大小盘, 总入球
        this.marketTypeKind[17].result = this.marketTypeKind[18].result = parseInt(data.goals_ht.split("-")[0]) + parseInt(data.goals_ht.split("-")[1]);
        // 半场 - 主队零失球获胜
        this.marketTypeKind[20].result = ((data.goals_ht.split("-")[0] > data.goals_ht.split("-")[1]) && data.goals_ht.split("-")[1] == 0) ? LangUtil("是") : LangUtil("否");
        // 半场 - 客队零失球获胜
        this.marketTypeKind[21].result = ((data.goals_ht.split("-")[0] < data.goals_ht.split("-")[1]) && data.goals_ht.split("-")[0] == 0) ? LangUtil("是") : LangUtil("否");
        // 半场 - 单/双
        this.marketTypeKind[22].result = (parseInt(data.goals_ht.split("-")[0]) + parseInt(data.goals_ht.split("-")[1])) % 2 == 0 ? LangUtil("双") : LangUtil("单");
        //半场 - 两队都得分
        this.marketTypeKind[23].result = (data.goals_ht.split("-")[0] > 0 && data.goals_ht.split("-")[1] > 0) ? LangUtil("是") : LangUtil("否");
        // 亚洲让球盘 - 全场加时
        this.marketTypeKind[25].result = data.goals_ot;
        // 亚洲大小盘 - 全场加时
        this.marketTypeKind[26].result = parseInt(data.goals_ot.split("-")[0]) + parseInt(data.goals_ot.split("-")[1]);
        // 亚洲让球盘 - 半场加时
        this.marketTypeKind[27].result = data.goals_otht;
        // 亚洲大小盘 - 半场加时
        this.marketTypeKind[28].result = parseInt(data.goals_otht.split("-")[0]) + parseInt(data.goals_otht.split("-")[1]);
        // 亚洲让球盘 - 加时后罚十二码
        this.marketTypeKind[29].result = data.goals_pk;
        // 亚洲大小盘 - 加时后罚十二码
        this.marketTypeKind[30].result = parseInt(data.goals_pk.split("-")[0]) + parseInt(data.goals_pk.split("-")[1]);
    }

    api_event_states(id: any) {
        const { unique } = this.listQueryMarket;
        const data = { event_id: id.toString(), unique }
        GlobalVar.loading = true;
        this.sendNotification(net.HttpType.api_event_states, data);
    }
}
