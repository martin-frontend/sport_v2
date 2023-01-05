import Http from "@/core/Http";
import Utils from "@/core/Utils";
import net from "./setting";
import { vo } from "./vo";
/**
 * 投注纪录
 */
export default class cmd_api_user_orders extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification) {
        const body = notification.getBody() || {};
        const url = Utils.getUrl(net.HttpType.api_user_orders, body);
        Http.post(url, body).then(<any>this.response.bind(this));
    }

    private response(result: vo.ResponseVO) {
        if (result.status === 0) {
            this.sendNotification(net.EventType.api_user_orders, result.data, result.unique);
        }
    }
}
