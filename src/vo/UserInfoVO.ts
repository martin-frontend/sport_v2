import { RemarkVO } from "./RemarkVO";

export interface UserInfoVO {
    fast_choose: string; //快捷投注选项
    able_to_choose_betterodds: number; //  是否显示更好賠率 0 否 / 1 是
    better_odds: number; //是否接受更好賠率的勾選 0 否 / 1 是
    gold: string; //金币
    currency_type: string;
    plat_min_stake: 0;
    plat_max_stake: 0;
    user_setting: {
        daynight_type: 1; //日夜模式
        lang: "en_US"; //语言
        market_type_ids: ""; //盘口
        sport_ids: ""; //体育项目
        remark: ""; //
    };
    username: string; //用户名
    wallet_type: number; //錢包類型 1=單一錢包,2=多錢包
    user_type: number;
}
