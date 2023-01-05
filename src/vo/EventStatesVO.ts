export interface EventStatesVO {
    corners_ft: string; //角球
    corners_ht: string;
    corners_ot: string;
    corners_otht: string;
    event_id: number;//赛事ID
    goals_ft: string; //比分
    goals_ht: string;
    goals_ot: string;
    goals_otht: string;
    goals_pk: string;
    last_time: number;
    match_id: string;//第三方赛事ID
    match_phase: "-"; // 如果是-，就显示开始时间，如果不是，就显示phase_minute
    match_version: 8;
    phase_minute: -1; //开赛进行的时间 -1就是还没开始
    red_cards_ft: string; //
    red_cards_ht: string;
    red_cards_ot: string;
    red_cards_otht: string;
    update_time: number;
    yellow_cards_ft: string; //
    yellow_cards_ht: string;
    yellow_cards_ot: string;
    yellow_cards_otht: string;
}
