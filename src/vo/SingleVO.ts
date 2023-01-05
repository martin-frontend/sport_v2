import { MarketVO } from "./MarketVO";
import { MatchVO } from "./MatchVO";

export interface SingleVO extends Omit<MatchVO, "event_id" | "market_amount" | "mid"> {
    competition_name: string; //联赛名
    live_id: number; //不明
    sport_id: number; //运动id
    status: number; //状态
    markets: MarketVO[];
}
