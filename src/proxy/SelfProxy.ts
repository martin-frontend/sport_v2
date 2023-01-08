import PlatConfig from "@/core/config/PlatConfig";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import net from "@/net/setting";
import { RemarkVO } from "@/vo/RemarkVO";
import { UserInfoVO } from "@/vo/UserInfoVO";
import SettingProxy from "@/proxy/SettingProxy";

export default class SelfProxy extends puremvc.Proxy {
    static NAME = "SelfProxy";

    private timerCount = 0;

    onRegister() {
        setInterval(() => {
            if (this.timerCount % 5 == 0) {
                this.api_user_info();
            }
            GlobalVar.server_time++;
            this.timerCount++;
        }, 1000);
    }

    /**用户信息 */
    userInfo: UserInfoVO = {
        currency_type: "",
        fast_choose: "10,20,30,40,50,60",
        gold: "0.00",
        username: "",
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
        Object.assign(this.userInfo, data);
    }

    api_user_info() {
        this.sendNotification(net.HttpType.api_user_info);
    }
}
