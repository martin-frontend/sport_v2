import Http from "@/core/Http";
import Utils from "@/core/Utils";
import net from "./setting";
import { vo } from "./vo";
/**
 * 三方获取注单详情
 */
export default class cmd_public_order_detail_data extends puremvc.SimpleCommand {
    private requestData: any;

    execute(notification: puremvc.INotification) {
        const body = (this.requestData = notification.getBody() || {});
        const url = Utils.getUrl(net.HttpType.public_order_detail_data, body);
        Http.post(url, body).then(<any>this.response.bind(this));
    }

    private response(result: vo.ResponseVO) {
        if (result.status === 0) {
            if (result.data && typeof result.data == "object") result.data.requestData = this.requestData;
            this.sendNotification(net.EventType.public_order_detail_data, result.data, this.requestData.unique);
        }
    }
}
