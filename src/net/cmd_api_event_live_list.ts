import Http from "@/core/Http";
import Utils from "@/core/Utils";
import net from "./setting";
import { vo } from "./vo";
/**
 * 直播清单接口
 */
export default class cmd_api_event_live_list extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification) {
        const body = notification.getBody() || {};
        const url = Utils.getUrl(net.HttpType.api_event_live_list, body);
        Http.post(url, body).then(<any>this.response.bind(this));
    }

    private response(result: vo.ResponseVO) {
        if (result.status === 0) {
            this.sendNotification(net.EventType.api_event_live_list, result.data, result.unique);
        }
    }
}
