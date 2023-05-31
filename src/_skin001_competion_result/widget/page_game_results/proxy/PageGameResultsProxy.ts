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
        { market_type: "MATCH_ODDS", name: LangUtil("主客和"), type: "FT", category: <any>[0], result: "" },
        { market_type: "ASIAN_HANDICAP", name: LangUtil("亚洲让球盘"), type: "FT", category: [0], result: "" },
        { market_type: "ASIAN_OVER_UNDER", name: LangUtil("亚洲大小盘"), type: "FT", category: [0], result: "" },
        { market_type: "TOTAL_GOALS", name: LangUtil("总入球"), type: "FT", category: [0], result: 0 },
        { market_type: "CR_ASIAN_OVER_UNDER", name: LangUtil("亚洲大小盘 - 角球"), type: "FT", category: [0], result: "" },
        { market_type: "CR_ASIAN_HANDICAP", name: LangUtil("亚洲让球盘 - 角球"), type: "FT", category: [0], result: "" },
        { market_type: "DRAW_NO_BET", name: LangUtil("平局退款"), type: "FT", category: [0], result: "" },
        { market_type: "BOTH_TEAMS_TO_SCORE", name: LangUtil("两队都得分"), type: "FT", category: [0], result: "" },
        { market_type: "MATCH_ODDS_HALF_TIME", name: LangUtil("半场 - 主客和"), type: "FT", category: [0], result: "" },
        { market_type: "HALF_TIME_FULL_TIME", name: LangUtil("半场/全场"), type: "FT", category: [0], result: "" },
        { market_type: "CORRECT_SCORE", name: LangUtil("波胆"), type: "FT", category: [0], result: "" },
        { market_type: "DOUBLE_CHANCE", name: LangUtil("双重机会/双胜彩"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_A_WIN_TO_NIL", name: LangUtil("主队零失球获胜"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_B_WIN_TO_NIL", name: LangUtil("客队零失球获胜"), type: "FT", category: [0], result: "" },
        { market_type: "ODD_OR_EVEN", name: LangUtil("入球单双"), type: "FT", category: [0], result: "" },
        { market_type: "ASIAN_HANDICAP_HALF_TIME", name: LangUtil("半场 - 亚洲让球盘"), type: "FT", category: [0], result: "" },
        { market_type: "DRAW_NO_BET_HALF_TIME", name: LangUtil("半场 - 平局退款"), type: "FT", category: [0], result: "" },
        { market_type: "ASIAN_OVER_UNDER_HALF_TIME", name: LangUtil("半场 - 亚洲大小盘"), type: "FT", category: [0], result: "" },
        { market_type: "TOTAL_GOALS_HALF_TIME", name: LangUtil("半场 - 总入球"), type: "FT", category: [0], result: "" },
        { market_type: "DOUBLE_CHANCE_HALF_TIME", name: LangUtil("半场 - 双重机会/双胜彩"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_A_WIN_TO_NIL_HALF_TIME", name: LangUtil("半场 - 主队零失球获胜"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_B_WIN_TO_NIL_HALF_TIME", name: LangUtil("半场 - 客队零失球获胜"), type: "FT", category: [0], result: "" },
        { market_type: "ODD_OR_EVEN_HALF_TIME", name: LangUtil("半场 - 单/双"), type: "FT", category: [0], result: "" },
        { market_type: "BOTH_TEAMS_TO_SCORE_HALF_TIME", name: LangUtil("半场 - 两队都得分"), type: "FT", category: [0], result: "" },
        { market_type: "CORRECT_SCORE_HALF_TIME", name: LangUtil("半场 - 波胆"), type: "FT", category: [0], result: "" },
        { market_type: "ASIAN_HANDICAP_EXTRA_TIME", name: LangUtil("亚洲让球盘 - 全场加时"), type: "OT", category: [0], result: "" },
        { market_type: "ASIAN_OVER_UNDER_EXTRA_TIME", name: LangUtil("亚洲大小盘 - 全场加时"), type: "OT", category: [0], result: "" },
        {
            market_type: "ASIAN_HANDICAP_EXTRA_TIME_HALF_TIME",
            name: LangUtil("亚洲让球盘 - 半场加时"),
            type: "OT",
            category: [0],
            result: "",
        },
        {
            market_type: "ASIAN_OVER_UNDER_EXTRA_TIME_HALF_TIME",
            name: LangUtil("亚洲大小盘 - 半场加时"),
            type: "OT",
            category: [0],
            result: "",
        },
        {
            market_type: "ASIAN_HANDICAP_AFTER_PENALTIES",
            name: LangUtil("亚洲让球盘 - 加时后罚十二码"),
            type: "PK",
            category: [0],
            result: "",
        },
        {
            market_type: "ASIAN_OVER_UNDER_AFTER_PENALTIES",
            name: LangUtil("亚洲大小盘 - 加时后罚十二码"),
            type: "PK",
            category: [0],
            result: "",
        },

        { market_type: "EITHER_TEAM_TO_SCORE", name: LangUtil("任意一队得分"), type: "FT", category: [0], result: "" },
        { market_type: "EITHER_TEAM_TO_SCORE_HALF_TIME", name: LangUtil("半场 - 任意一队得分"), type: "FT", category: [0], result: "" },
        {
            market_type: "EITHER_TEAM_TO_SCORE_THREE_OR_MORE",
            name: LangUtil("任意一队得三分或以上"),
            type: "FT",
            category: [0],
            result: "",
        },
        {
            market_type: "EITHER_TEAM_TO_SCORE_THREE_OR_MORE_HALF_TIME",
            name: LangUtil("半场 - 任意一队得分三次或以上"),
            type: "FT",
            category: [0],
            result: "",
        },
        {
            market_type: "EITHER_TEAM_TO_SCORE_TWICE_OR_MORE",
            name: LangUtil("任意一队得两分或以上"),
            type: "FT",
            category: [0],
            result: "",
        },
        {
            market_type: "EITHER_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
            name: LangUtil("半场 - 任意一队得分两次或以上"),
            type: "FT",
            category: [0],
            result: "",
        },
        { market_type: "TEAM_A_TO_SCORE", name: LangUtil("主队得分"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_A_TO_SCORE_HALF_TIME", name: LangUtil("半场 - 主队得分"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_A_TO_SCORE_TWICE_OR_MORE", name: LangUtil("主队得分两次或以上"), type: "FT", category: [0], result: "" },
        {
            market_type: "TEAM_A_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
            name: LangUtil("半场 - 主队得分两次或以上"),
            type: "FT",
            category: [0],
            result: "",
        },
        { market_type: "TEAM_B_TO_SCORE", name: LangUtil("客队得分"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_B_TO_SCORE_HALF_TIME", name: LangUtil("半场 - 客队得分"), type: "FT", category: [0], result: "" },

        { market_type: "TEAM_B_TO_SCORE_TWICE_OR_MORE", name: LangUtil("客队得分两次或以上"), type: "FT", category: [0], result: "" },
        {
            market_type: "TEAM_B_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
            name: LangUtil("半场 - 客队得分两次或以上"),
            type: "FT",
            category: [0],
            result: "",
        },
        { market_type: "BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE", name: LangUtil("两队都得分两次或以上"), type: "FT", category: [0], result: "" },
        {
            market_type: "BOTH_TEAMS_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
            name: LangUtil("半场 - 两队都得分两分或以上"),
            type: "FT",
            category: [0],
            result: "",
        },
        { market_type: "TEAM_A_GOALS_ODD_OR_EVEN", name: LangUtil("主队得分单/双"), type: "FT", category: [0], result: "" },
        {
            market_type: "TEAM_A_GOALS_ODD_OR_EVEN_HALF_TIME",
            name: LangUtil("半场 - 主队得分单/双"),
            type: "FT",
            category: [0],
            result: "",
        },
        { market_type: "TEAM_B_GOALS_ODD_OR_EVEN", name: LangUtil("客队得分单/双"), type: "FT", category: [0], result: "" },
        {
            market_type: "TEAM_B_GOALS_ODD_OR_EVEN_HALF_TIME",
            name: LangUtil("半场 - 客队得分单/双"),
            type: "FT",
            category: [0],
            result: "",
        },
        { market_type: "3_WAY_HANDICAP_PLUS_1", name: LangUtil("让球主客和 [+1]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_PLUS_2", name: LangUtil("让球主客和 [+2]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_PLUS_3", name: LangUtil("让球主客和 [+3]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_PLUS_4", name: LangUtil("让球主客和 [+4]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_MINUS_1", name: LangUtil("让球主客和 [-1]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_MINUS_2", name: LangUtil("让球主客和 [-2]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_MINUS_3", name: LangUtil("让球主客和 [-3]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_MINUS_4", name: LangUtil("让球主客和 [-4]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_PLUS_1_HALF_TIME", name: LangUtil("半场 - 让球主客和 [+1]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_PLUS_2_HALF_TIME", name: LangUtil("半场 - 让球主客和 [+2]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_PLUS_3_HALF_TIME", name: LangUtil("半场 - 让球主客和 [+3]"), type: "FT", category: [0], result: "" },
        { market_type: "3_WAY_HANDICAP_PLUS_4_HALF_TIME", name: LangUtil("半场 - 让球主客和 [+4]"), type: "FT", category: [0], result: "" },
        {
            market_type: "3_WAY_HANDICAP_MINUS_1_HALF_TIME",
            name: LangUtil("半场 - 让球主客和 [-1]"),
            type: "FT",
            category: [0],
            result: "",
        },

        {
            market_type: "3_WAY_HANDICAP_MINUS_2_HALF_TIME",
            name: LangUtil("半场 - 让球主客和 [-2]"),
            type: "FT",
            category: [0],
            result: "",
        },

        {
            market_type: "3_WAY_HANDICAP_MINUS_3_HALF_TIME",
            name: LangUtil("半场 - 让球主客和 [-3]"),
            type: "FT",
            category: [0],
            result: "",
        },

        {
            market_type: "3_WAY_HANDICAP_MINUS_4_HALF_TIME",
            name: LangUtil("半场 - 让球主客和 [-4]"),
            type: "FT",
            category: [0],
            result: "",
        },

        { market_type: "WINNING_MARGIN", name: LangUtil("输赢比数"), type: "FT", category: [0], result: "" },
        { market_type: "WINNING_MARGIN_HALF_TIME", name: LangUtil("半场 - 输赢比数"), type: "FT", category: [0], result: "" },
        { market_type: "TOTAL_GOALS_RANGE", name: LangUtil("总入球范围"), type: "FT", category: [0], result: "" },
        { market_type: "TOTAL_GOALS_RANGE_HALF_TIME", name: LangUtil("半场 - 总入球范围"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_A_EXACT_GOALS", name: LangUtil("主队总入球"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_A_EXACT_GOALS_HALF_TIME", name: LangUtil("半场 - 主队总入球"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_B_EXACT_GOALS", name: LangUtil("客队总入球"), type: "FT", category: [0], result: "" },
        { market_type: "TEAM_B_EXACT_GOALS_HALF_TIME", name: LangUtil("半场 - 客队总入球"), type: "FT", category: [0], result: "" },

        { market_type: "MATCH_ODDS_AND_OVER_UNDER_2.5", name: LangUtil("主客和 & 2.5球大/小"), type: "FT", category: [0], result: "" },
        {
            market_type: "MATCH_ODDS_AND_OVER_UNDER_2.5_HALF_TIME",
            name: LangUtil("半场 - 主客和 & 2.5球大/小"),
            type: "FT",
            category: [0],
            result: "",
        },
        { market_type: "ODD_OR_EVEN_AND_OVER_UNDER_2.5", name: LangUtil("入球单双 & 2.5球大/小"), type: "FT", category: [0], result: "" },
        {
            market_type: "ODD_OR_EVEN_AND_OVER_UNDER_2.5_HALF_TIME",
            name: LangUtil("半场 - 入球单双 & 2.5球大/小"),
            type: "FT",
            category: [0],
            result: "",
        },
        { market_type: "MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE", name: LangUtil("主客和 & 两队都得分"), type: "FT", category: [0], result: "" },
        {
            market_type: "MATCH_ODDS_AND_BOTH_TEAMS_TO_SCORE_HALF_TIME",
            name: LangUtil("半场 - 主客和 & 两队都得分"),
            type: "FT",
            category: [0],
            result: "",
        },
        {
            market_type: "BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2.5",
            name: LangUtil("两队都得分 & 2.5球大/小"),
            type: "FT",
            category: [0],
            result: "",
        },
        {
            market_type: "BOTH_TEAMS_TO_SCORE_AND_OVER_UNDER_2.5_HALF_TIME",
            name: LangUtil("半场 - 两队都得分 & 2.5球大/小"),
            type: "FT",
            category: [0],
            result: "",
        },
        {
            market_type: "BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE",
            name: LangUtil("两队都得分 & 任意一队得两分或以上"),
            type: "FT",
            category: [0],
            result: "",
        },
        {
            market_type: "BOTH_TEAMS_TO_SCORE_AND_ONE_TEAM_TO_SCORE_TWICE_OR_MORE_HALF_TIME",
            name: LangUtil("半场 - 两队都得分 & 任意一队得两分或以上"),
            type: "FT",
            category: [0],
            result: "",
        },
    ];

    marketTypeOptions: any[] = [];

    updateMarketTypeOptions() {
        const arr = [{ id: 0, name: LangUtil("所有") }];
        arr.push(...PlatConfig.market_main_type);
        for (const item of this.marketTypeKind) {
            const type = PlatConfig.allMarketType.filter((el) => el.market_type == item.market_type);
            if (type.length > 0) {
                item.category.push(
                    ...type[0].main_type.split(",").map(function (x) {
                        return parseInt(x);
                    })
                );
            }
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
            this.pageData.marketType.push(...this.marketTypeKind.filter((el) => el.type == "FT" || el.type == "OT"));
            this.pageData.selectedMarketType.push(...this.marketTypeKind.filter((el) => el.type == "FT" || el.type == "OT"));
        } else {
            //正规盘口
            this.pageData.marketType.push(...this.marketTypeKind.filter((el) => el.type == "FT"));
            this.pageData.selectedMarketType.push(...this.marketTypeKind.filter((el) => el.type == "FT"));
        }
    }

    set_results(data: any) {
        // 全场 - 主客和 平局退款 双重机会/双胜彩
        const homeScore = parseInt(data.goals_ft.split("-")[0]);
        const awayScore = parseInt(data.goals_ft.split("-")[1]);
        const homeScoreHF = parseInt(data.goals_ht.split("-")[0]);
        const awayScoreHF = parseInt(data.goals_ht.split("-")[1]);
        if (homeScore > awayScore) {
            this.marketTypeKind[0].result = this.marketTypeKind[6].result = this.marketTypeKind[11].result = this.pageData.matche.home_team;
        } else if (homeScore == awayScore) {
            this.marketTypeKind[0].result = this.marketTypeKind[6].result = this.marketTypeKind[11].result = LangUtil("和");
        } else {
            this.marketTypeKind[0].result = this.marketTypeKind[6].result = this.marketTypeKind[11].result = this.pageData.matche.away_team;
        }
        // 全场 - 亚洲让球盘, 波胆
        this.marketTypeKind[1].result = this.marketTypeKind[10].result = data.goals_ft;
        // 全场 - 总入球, 亚洲大小盘
        this.marketTypeKind[2].result = this.marketTypeKind[3].result = homeScore + awayScore;
        // 全场 - 亚洲大小盘 - 角球
        this.marketTypeKind[4].result = parseInt(data.corners_ft.split("-")[0]) + parseInt(data.corners_ft.split("-")[1]);
        // 全场 - 亚洲让球盘 - 角球
        this.marketTypeKind[5].result = data.corners_ft;
        // 两队都得分
        this.marketTypeKind[7].result = homeScore > 0 && awayScore > 0 ? LangUtil("是") : LangUtil("否");
        // 半场 - 主客和, 平局退款, 双重机会/双胜彩,
        if (homeScoreHF > awayScoreHF) {
            this.marketTypeKind[8].result =
                this.marketTypeKind[16].result =
                this.marketTypeKind[19].result =
                    this.pageData.matche.home_team;
        } else if (homeScoreHF == awayScoreHF) {
            this.marketTypeKind[8].result = this.marketTypeKind[16].result = this.marketTypeKind[19].result = LangUtil("和");
        } else {
            this.marketTypeKind[8].result =
                this.marketTypeKind[16].result =
                this.marketTypeKind[19].result =
                    this.pageData.matche.away_team;
        }
        // 半场/全场
        this.marketTypeKind[9].result = this.marketTypeKind[8].result + "-" + this.marketTypeKind[0].result;
        // 主队零失球获胜
        this.marketTypeKind[12].result = homeScore > awayScore && awayScore == 0 ? LangUtil("是") : LangUtil("否");
        // 客队零失球获胜
        this.marketTypeKind[13].result = homeScore < awayScore && homeScore == 0 ? LangUtil("是") : LangUtil("否");
        // 入球单双
        this.marketTypeKind[14].result = (homeScore + awayScore) % 2 == 0 ? LangUtil("双") : LangUtil("单");
        // 半场 - 波胆
        this.marketTypeKind[15].result = this.marketTypeKind[24].result = data.goals_ht;
        // 半场 - 亚洲大小盘, 总入球
        this.marketTypeKind[17].result = this.marketTypeKind[18].result = homeScoreHF + awayScoreHF;
        // 半场 - 主队零失球获胜
        this.marketTypeKind[20].result = homeScoreHF > awayScoreHF && awayScoreHF == 0 ? LangUtil("是") : LangUtil("否");
        // 半场 - 客队零失球获胜
        this.marketTypeKind[21].result = homeScoreHF < awayScoreHF && homeScoreHF == 0 ? LangUtil("是") : LangUtil("否");
        // 半场 - 单/双
        this.marketTypeKind[22].result = (homeScoreHF + awayScoreHF) % 2 == 0 ? LangUtil("双") : LangUtil("单");
        //半场 - 两队都得分
        this.marketTypeKind[23].result = homeScoreHF > 0 && awayScoreHF > 0 ? LangUtil("是") : LangUtil("否");
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
        //任意一队得分
        this.marketTypeKind[31].result = homeScore + awayScore > 0 ? LangUtil("是") : LangUtil("否");
        //任意一队得分 半场
        this.marketTypeKind[32].result = homeScoreHF + awayScoreHF > 0 ? LangUtil("是") : LangUtil("否");
        //任意一队得三分或以上
        this.marketTypeKind[33].result = homeScore >= 3 || awayScore >= 3 ? LangUtil("是") : LangUtil("否");
        //任意一队得三分或以上 半场
        this.marketTypeKind[34].result = homeScoreHF >= 3 || awayScoreHF >= 3 ? LangUtil("是") : LangUtil("否");
        //任意一队得两分或以上
        this.marketTypeKind[35].result = homeScore >= 2 || awayScore >= 2 ? LangUtil("是") : LangUtil("否");
        //任意一队得两分或以上 半场
        this.marketTypeKind[36].result = homeScoreHF >= 2 || awayScoreHF >= 2 ? LangUtil("是") : LangUtil("否");
        //主队得分
        this.marketTypeKind[37].result = homeScore > 0 ? LangUtil("是") : LangUtil("否");
        //主队得分 半场
        this.marketTypeKind[38].result = homeScoreHF > 0 ? LangUtil("是") : LangUtil("否");
        //主队得分两分或以上
        this.marketTypeKind[39].result = homeScore >= 2 ? LangUtil("是") : LangUtil("否");
        //主队得分两分或以上 半场
        this.marketTypeKind[40].result = homeScoreHF >= 2 ? LangUtil("是") : LangUtil("否");
        //客队得分
        this.marketTypeKind[41].result = awayScore > 0 ? LangUtil("是") : LangUtil("否");
        //客队得分 半场
        this.marketTypeKind[42].result = awayScoreHF > 0 ? LangUtil("是") : LangUtil("否");
        //客队得分两分或以上
        this.marketTypeKind[43].result = awayScore >= 2 ? LangUtil("是") : LangUtil("否");
        //客队得分两分或以上 半场
        this.marketTypeKind[44].result = awayScoreHF >= 2 ? LangUtil("是") : LangUtil("否");
        //两队都得分兩次或以上
        this.marketTypeKind[45].result = homeScore >= 2 && awayScore >= 2 ? LangUtil("是") : LangUtil("否");
        //两队都得分兩次或以上 半场
        this.marketTypeKind[46].result = homeScoreHF >= 2 && awayScoreHF >= 2 ? LangUtil("是") : LangUtil("否");
        //主队得分单双
        this.marketTypeKind[47].result = homeScore % 2 == 0 ? LangUtil("双") : LangUtil("单");
        //主队得分单双 半场
        this.marketTypeKind[48].result = homeScoreHF % 2 == 0 ? LangUtil("双") : LangUtil("单");
        //客队得分单双
        this.marketTypeKind[49].result = awayScore % 2 == 0 ? LangUtil("双") : LangUtil("单");
        //客队得分单双 半场
        this.marketTypeKind[50].result = awayScoreHF % 2 == 0 ? LangUtil("双") : LangUtil("单");
        const numarr = [1, 2, 3, 4, -1, -2, -3, -4, 1, 2, 3, 4, -1, -2, -3, -4];

        for (let i = 51; i <= 66; i++) {
            let Way_handicap = numarr[i - 51];

            if (i >= 51 && i <= 58) {
                const rs = homeScore - awayScore + Way_handicap;
                this.marketTypeKind[i].result =
                    rs == 0 ? LangUtil("和") : rs > 0 ? this.pageData.matche.home_team : this.pageData.matche.away_team;
            }
            if (i >= 59 && i <= 66) {
                const rs = homeScoreHF - awayScoreHF + Way_handicap;
                this.marketTypeKind[i].result =
                    rs == 0 ? LangUtil("和") : rs > 0 ? this.pageData.matche.home_team : this.pageData.matche.away_team;
            }
        }
        //输赢比数
        let rs = Math.abs(homeScore - awayScore);
        let str = "";
        if (rs == 0) {
            str = LangUtil("比分平局");
        } else if (rs == 1) {
            str = LangUtil("输赢比数1球");
        } else if (rs == 2) {
            str = LangUtil("输赢比数2球");
        } else if (rs == 3) {
            str = LangUtil("输赢比数3球");
        } else if (rs >= 4) {
            str = LangUtil("输赢比数4球或更多");
        }
        this.marketTypeKind[67].result = str;
        //输赢比数 半场
        rs = Math.abs(homeScoreHF - awayScoreHF);
        str = "";
        if (rs == 0) {
            str = LangUtil("比分平局");
        } else if (rs == 1) {
            str = LangUtil("输赢比数1球");
        } else if (rs == 2) {
            str = LangUtil("输赢比数2球");
        } else if (rs == 3) {
            str = LangUtil("输赢比数3球");
        } else if (rs >= 4) {
            str = LangUtil("输赢比数4球或更多");
        }
        this.marketTypeKind[68].result = str;
        //总入球范围
        rs = homeScore + awayScore;
        str = "";
        if (rs <= 1) {
            str = LangUtil("无进球或1球");
        } else if (rs >= 2 && rs <= 3) {
            str = LangUtil("2球或3球");
        } else if (rs >= 4 && rs <= 5) {
            str = LangUtil("4球或5球");
        } else if (rs > 5) {
            str = LangUtil("6球或更多");
        }
        this.marketTypeKind[69].result = str;
        //总入球范围 半场
        rs = homeScoreHF + awayScoreHF;
        str = "";
        if (rs <= 1) {
            str = LangUtil("无进球或1球");
        } else if (rs >= 2 && rs <= 3) {
            str = LangUtil("2球或3球");
        } else if (rs >= 4 && rs <= 5) {
            str = LangUtil("4球或5球");
        } else if (rs > 5) {
            str = LangUtil("6球或更多");
        }
        this.marketTypeKind[70].result = str;
        //主队总入球
        rs = homeScore;
        str = "";
        if (rs == 0) {
            str = LangUtil("无进球");
        } else if (rs == 1) {
            str = LangUtil("总入球1球");
        } else if (rs == 2) {
            str = LangUtil("总入球2球");
        } else if (rs == 3) {
            str = LangUtil("总入球3球");
        } else if (rs >= 4) {
            str = LangUtil("总入球4球或更多");
        }
        this.marketTypeKind[71].result = str;
        //主队总入球
        rs = homeScoreHF;
        str = "";
        if (rs == 0) {
            str = LangUtil("无进球");
        } else if (rs == 1) {
            str = LangUtil("总入球1球");
        } else if (rs == 2) {
            str = LangUtil("总入球2球");
        } else if (rs == 3) {
            str = LangUtil("总入球3球");
        } else if (rs >= 4) {
            str = LangUtil("总入球4球或更多");
        }
        this.marketTypeKind[72].result = str;

        //客队总入球
        rs = awayScore;
        str = "";
        if (rs == 0) {
            str = LangUtil("无进球");
        } else if (rs == 1) {
            str = LangUtil("总入球1球");
        } else if (rs == 2) {
            str = LangUtil("总入球2球");
        } else if (rs == 3) {
            str = LangUtil("总入球3球");
        } else if (rs >= 4) {
            str = LangUtil("总入球4球或更多");
        }
        this.marketTypeKind[73].result = str;
        //客队总入球
        rs = awayScoreHF;
        str = "";
        if (rs == 0) {
            str = LangUtil("无进球");
        } else if (rs == 1) {
            str = LangUtil("总入球1球");
        } else if (rs == 2) {
            str = LangUtil("总入球2球");
        } else if (rs == 3) {
            str = LangUtil("总入球3球");
        } else if (rs >= 4) {
            str = LangUtil("总入球4球或更多");
        }
        this.marketTypeKind[74].result = str;
        //主客和 & 2.5球大/小
        let goals0 = homeScore;
        let goals1 = awayScore;
        if (goals0 > goals1 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("主")}-${LangUtil("大大")}`;
        } else if (goals0 > goals1 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("主")}-${LangUtil("小小")}`;
        } else if (goals0 < goals1 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("客")}-${LangUtil("大大")}`;
        } else if (goals0 < goals1 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("客")}-${LangUtil("小小")}`;
        } else if (goals0 == goals1 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("和")}-${LangUtil("大大")}`;
        } else if (goals0 == goals1 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("和")}-${LangUtil("小小")}`;
        }
        this.marketTypeKind[75].result = str;
        //主客和 & 2.5球大/小 半场
        goals0 = homeScoreHF;
        goals1 = awayScoreHF;
        if (goals0 > goals1 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("主")}-${LangUtil("大大")}`;
        } else if (goals0 > goals1 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("主")}-${LangUtil("小小")}`;
        } else if (goals0 < goals1 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("客")}-${LangUtil("大大")}`;
        } else if (goals0 < goals1 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("客")}-${LangUtil("小小")}`;
        } else if (goals0 == goals1 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("和")}-${LangUtil("大大")}`;
        } else if (goals0 == goals1 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("和")}-${LangUtil("小小")}`;
        }
        this.marketTypeKind[76].result = str;
        //入球单双 & 2.5球大/小
        goals0 = homeScore;
        goals1 = awayScore;
        if ((goals0 + goals1) % 2 == 1 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("单")}-${LangUtil("大大")}`;
        } else if ((goals0 + goals1) % 2 == 1 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("单")}-${LangUtil("小小")}`;
        } else if ((goals0 + goals1) % 2 == 0 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("双")}-${LangUtil("大大")}`;
        } else if ((goals0 + goals1) % 2 == 0 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("双")}-${LangUtil("小小")}`;
        }
        this.marketTypeKind[77].result = str;
        //入球单双 & 2.5球大/小 半场
        goals0 = homeScoreHF;
        goals1 = awayScoreHF;
        if ((goals0 + goals1) % 2 == 1 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("单")}-${LangUtil("大大")}`;
        } else if ((goals0 + goals1) % 2 == 1 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("单")}-${LangUtil("小小")}`;
        } else if ((goals0 + goals1) % 2 == 0 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("双")}-${LangUtil("大大")}`;
        } else if ((goals0 + goals1) % 2 == 0 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("双")}-${LangUtil("小小")}`;
        }
        this.marketTypeKind[78].result = str;
        //主客和 & 两队都得分
        goals0 = homeScore;
        goals1 = awayScore;
        if (goals0 > goals1 && goals0 > 0 && goals1 > 0) {
            str = `${LangUtil("主")}-${LangUtil("是")}`;
        } else if (goals0 > goals1 && !(goals0 > 0 && goals1 > 0)) {
            str = `${LangUtil("主")}-${LangUtil("否")}`;
        } else if (goals0 < goals1 && goals0 > 0 && goals1 > 0) {
            str = `${LangUtil("客")}-${LangUtil("是")}`;
        } else if (goals0 < goals1 && !(goals0 > 0 && goals1 > 0)) {
            str = `${LangUtil("主")}-${LangUtil("否")}`;
        } else if (goals0 == goals1 && goals0 > 0 && goals1 > 0) {
            str = `${LangUtil("和")}-${LangUtil("是")}`;
        } else if (goals0 == goals1 && !(goals0 > 0 && goals1 > 0)) {
            str = `${LangUtil("和")}-${LangUtil("否")}`;
        }
        this.marketTypeKind[79].result = str;
        //主客和 & 两队都得分 半场
        goals0 = homeScoreHF;
        goals1 = awayScoreHF;
        if (goals0 > goals1 && goals0 > 0 && goals1 > 0) {
            str = `${LangUtil("主")}-${LangUtil("是")}`;
        } else if (goals0 > goals1 && !(goals0 > 0 && goals1 > 0)) {
            str = `${LangUtil("主")}-${LangUtil("否")}`;
        } else if (goals0 < goals1 && goals0 > 0 && goals1 > 0) {
            str = `${LangUtil("客")}-${LangUtil("是")}`;
        } else if (goals0 < goals1 && !(goals0 > 0 && goals1 > 0)) {
            str = `${LangUtil("客")}-${LangUtil("否")}`;
        } else if (goals0 == goals1 && goals0 > 0 && goals1 > 0) {
            str = `${LangUtil("和")}-${LangUtil("是")}`;
        } else if (goals0 == goals1 && !(goals0 > 0 && goals1 > 0)) {
            str = `${LangUtil("和")}-${LangUtil("否")}`;
        }
        this.marketTypeKind[80].result = str;
        //两队都得分 & 2.5球大/小
        goals0 = homeScore;
        goals1 = awayScore;
        if (goals0 > 0 && goals1 > 0 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("是")}-${LangUtil("大大")}`;
        } else if (goals0 > 0 && goals1 > 0 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("是")}-${LangUtil("小小")}`;
        } else if (!(goals0 > 0 && goals1 > 0) && goals0 + goals1 > 2.5) {
            str = `${LangUtil("否")}-${LangUtil("大大")}`;
        } else if (!(goals0 > 0 && goals1 > 0) && goals0 + goals1 < 2.5) {
            str = `${LangUtil("否")}-${LangUtil("小小")}`;
        }
        this.marketTypeKind[81].result = str;
        //两队都得分 & 2.5球大/小 半场
        goals0 = homeScoreHF;
        goals1 = awayScoreHF;
        if (goals0 > 0 && goals1 > 0 && goals0 + goals1 > 2.5) {
            str = `${LangUtil("是")}-${LangUtil("大大")}`;
        } else if (goals0 > 0 && goals1 > 0 && goals0 + goals1 < 2.5) {
            str = `${LangUtil("是")}-${LangUtil("小小")}`;
        } else if (!(goals0 > 0 && goals1 > 0) && goals0 + goals1 > 2.5) {
            str = `${LangUtil("否")}-${LangUtil("大大")}`;
        } else if (!(goals0 > 0 && goals1 > 0) && goals0 + goals1 < 2.5) {
            str = `${LangUtil("否")}-${LangUtil("小小")}`;
        }
        this.marketTypeKind[82].result = str;
        //两队都得分 & 任意一队得两分或以上
        goals0 = homeScore;
        goals1 = awayScore;
        if (goals0 > 0 && goals1 > 0 && (goals0 > 1 || goals1 > 1)) {
            str = LangUtil("是");
        } else if (!(goals0 > 0 && goals1 > 0) && goals0 + goals1 < 2.5) {
            str = LangUtil("否");
        }
        this.marketTypeKind[83].result = str;
        //两队都得分 & 任意一队得两分或以上 半场
        goals0 = homeScoreHF;
        goals1 = awayScoreHF;
        if (goals0 > 0 && goals1 > 0 && (goals0 > 1 || goals1 > 1)) {
            str = LangUtil("是");
        } else if (!(goals0 > 0 && goals1 > 0) && goals0 + goals1 < 2.5) {
            str = LangUtil("否");
        }
        this.marketTypeKind[84].result = str;
    }

    api_event_states(id: any) {
        const { unique } = this.listQueryMarket;
        const data = { event_id: id.toString(), unique };
        GlobalVar.loading = true;
        this.sendNotification(net.HttpType.api_event_states, data);
    }
}
