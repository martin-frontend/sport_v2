import PlatConfig from "@/core/config/PlatConfig";
import getProxy from "@/core/global/getProxy";
import GlobalVar from "@/core/global/GlobalVar";
import net from "@/net/setting";
import { RemarkVO } from "@/vo/RemarkVO";
import { UserInfoVO } from "@/vo/UserInfoVO";
import SettingProxy from "@/_skin001/views/setting/proxy/SettingProxy";

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
        const settingProxy:SettingProxy = getProxy(SettingProxy);
        try {
            const remark: RemarkVO = JSON.parse(this.userInfo.user_setting.remark);
            GlobalVar.MarketType_area = remark.MarketType_area;
            if (this.timerCount == 0) {
                GlobalVar.currency = data.currency_type; //币别
                GlobalVar.zone = remark.timezone;
                settingProxy.resetForm();
            }
        } catch (err: any) {
            GlobalVar.MarketType_area = PlatConfig.config.client.MarketType_area;
            if (this.timerCount == 0) {
                GlobalVar.currency = data.currency_type; //币别
                const offset = -(new Date().getTimezoneOffset() / 60);
                GlobalVar.zone = offset >= 0 ? `+${offset}` : `${offset}`;
                settingProxy.resetForm();
            }
        }
    }

    api_user_info() {
        this.sendNotification(net.HttpType.api_user_info);
    }
}
