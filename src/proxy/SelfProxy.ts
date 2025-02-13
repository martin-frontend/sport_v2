import GlobalVar from "@/core/global/GlobalVar";
import net from "@/net/setting";
import { UserInfoVO } from "@/vo/UserInfoVO";
import Vue from "vue";

export default class SelfProxy extends puremvc.Proxy {
    static NAME = "SelfProxy";

    private timerCount = 0;

    onRegister() {
        // setInterval(() => {
        //     if (this.timerCount % 5 == 0 && GlobalVar.pageType == "skin001") {
        //         this.api_user_info();
        //     }
        //     GlobalVar.server_time++;
        //     this.timerCount++;
        // }, 1000);
        this.api_user_info();
    }

    /**用户信息 */
    userInfo: UserInfoVO = {
        better_odds: parseInt(window.localStorage.getItem("better_odds") || "0"),
        able_to_choose_betterodds: 1,
        currency_type: "",
        fast_choose: "10,20,30,40,50,60",
        gold: "0.00",
        username: "",
        user_type: 2,
        wallet_type: 1,
        plat_min_stake: 0,
        plat_max_stake: 0,
        user_setting: {
            daynight_type: 1,
            lang: "en_US",
            market_type_ids: "",
            sport_ids: "",
            remark: "",
        },
    };

    /**写入 用户信息 */
    set_user_info(data: any) {
        GlobalVar.currency = data.currency_type;
        Object.assign(this.userInfo, data);
        // 服务端有时候会传number类型过来。此时转换一下
        if (typeof this.userInfo.gold == "number") {
            // @ts-ignore
            this.userInfo.gold = this.userInfo.gold.toString();
        }
    }

    api_user_info() {
        //@ts-ignore
        if (window["vm"] && window["vm"]._isMounted) {
            this.sendNotification(net.HttpType.api_user_info);
        }
    }
}
