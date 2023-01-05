import { MatchVO } from "./MatchVO";

export interface EventLiveVO extends MatchVO{
    away_score: number; //客队比分
    competition_name: string; //联赛名
    home_score: number; //主队比分
    image_id: number; //未知
    live_image_url: string; //视频展示图片
    show_front: number; //1显示直播 2显示图片，
}
