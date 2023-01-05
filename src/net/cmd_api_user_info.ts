import Http from "@/core/Http";
import Utils from "@/core/Utils";
import net from "./setting";
import { vo } from "./vo";
/**
 * 取得用户基本讯息
 */
export default class cmd_api_user_info extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification) {
        const body = notification.getBody() || {};
        const url = Utils.getUrl(net.HttpType.api_user_info, body);
        Http.post(url, body).then(<any>this.response.bind(this));
    }

    private response(result: vo.ResponseVO) {
        if (result.status === 0) {
            this.sendNotification(net.EventType.api_user_info, result.data, result.unique);
        }
    }
}
