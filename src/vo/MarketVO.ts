export interface MarketVO {
    event_id: number; //赛事ID
    ex_markets: MarketExVO; //交易所
    fix_markets: MarketFixVO; //固赔
    type: "fix"; //类型  fix / exchange / all
    market_type: "";
}

export interface MarketFixVO {
    cn: string; //盘口名 中文
    en: string; //盘口名 英文
    hint: string; // 提示
    id: number; //盘口ID
    market_id: string; //投注时使用
    market_name: "Match Odds"; //盘口名 不用
    market_type: "MATCH_ODDS"; //投注时使用
    match_id: "FBL-317564"; //赛事ID 第三方
    priority: 0; // 未知
    selections: FixSelectionVO[];
    status: number; // 未知
    title: string; //盘口名 不用
}

export interface FixSelectionVO {
    handicap: ""; //未知
    id: 0; //下注时使用
    lineIndex: -1; //未知
    name: string;
    order: number;
    price: { back: string; lay: string; maxStake: string; minStake: string };
    probability: string;
    status: 0;
    statusName: string;
    type: string;
}

export interface MarketExVO {
    betting_type: string;
    event_id: number; //第三方赛事ID
    hint: string; //提示
    id: number;
    market_id: string; //盘口ID 下注用
    market_type: string; //盘口类型 下注用
    name: string;
    runners: ExRunnersVO[];
    start_time: string;
    status: number;
    total_matched: number;
}

export interface ExRunnersVO {
    ex: ExVO[];
    handicap: number; //下注用需转string
    runnerName: string; //主客队名称或The Draw
    selectionId: number; //所选择的运营商 下注用需转string
    sortPriority: number;
    status: string;
}

export interface ExVO {
    availableToBack: AvailableVO[];
    availableToLay: AvailableVO[];
    tradedVolume: [];
}

export interface AvailableVO {
    price: number; //交易所价格 下注用需转string
    size: number; //投注金额 下注用需转string
}
