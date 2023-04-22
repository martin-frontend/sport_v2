export interface MatchVO {
    away_team: string;
    away_team_icon: string;
    competition_id: number;
    event_id: string; //第三方ID
    home_team: string;
    home_team_icon: string;
    id: number; //赛事ID
    market_amount: number; //盘口数量
    mid: number;
    name: string; //赛事名
    start_time: string; //开赛时间
    sb_time: number; //开赛时间戳
    animation_status: number; //动画数据
    animation_id: string; //动画ID
    group_match: string; //赛事分组 副标题

    live_status: number; //直播数据 1:已配置 2:未配置
    live_url: string; //直播地址
}
