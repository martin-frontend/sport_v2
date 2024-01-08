import net from "@/net/setting";
import dialog_message_box from "../views/dialog_message_box";
import LangUtil from "@/core/global/LangUtil";

export default class RequestErrorCMD extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification) {
        const body = notification.getBody();
        const url = body.config.url;

        const ignoreArr = [
            net.HttpType.api_market_typelist,
            net.HttpType.api_event_states,
            net.HttpType.api_user_pending,
            net.HttpType.api_user_prebet_v3,
            net.HttpType.api_user_precashout,
            net.HttpType.api_user_info,
        ];
        if (!ignoreArr.includes(url)) {
            dialog_message_box.alert({
                message: LangUtil("请检查网络"),
                okFun: () => {
                    location.reload();
                },
            });
        }
    }
}
