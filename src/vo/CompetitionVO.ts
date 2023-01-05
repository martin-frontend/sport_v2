import { MatchVO } from "./MatchVO";

export interface CompetitionVO {
    competition_id: number; //联赛ID
    competition_name: string; //联赛名
    count: number; //赛事数量
    matches: MatchVO[]; //赛事
}
