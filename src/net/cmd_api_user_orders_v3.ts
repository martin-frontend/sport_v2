import Http from "@/core/Http";
import Utils from "@/core/Utils";
import net from "./setting";
import { vo } from "./vo";
/**
 * 投注纪录v3
 */
export default class cmd_api_user_orders_v3 extends puremvc.SimpleCommand {
    private requestData: any;

    execute(notification: puremvc.INotification) {
        const body = (this.requestData = notification.getBody() || {});
        const url = Utils.getUrl(net.HttpType.api_user_orders_v3, body);
        Http.post(url, body).then(<any>this.response.bind(this));
    }

    private response(result: vo.ResponseVO) {
        if (result.status === 0) {
            if(result.data && typeof result.data == "object") result.data.requestData = this.requestData;
            this.sendNotification(net.EventType.api_user_orders_v3, result.data, this.requestData.unique);
        }
    }
}
