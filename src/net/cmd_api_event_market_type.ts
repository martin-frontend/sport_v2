import Http from "@/core/Http";
import Utils from "@/core/Utils";
import net from "./setting";
import { vo } from "./vo";
/**
 * 前台客製化選項-获取所有有效体育盘口资讯接口(弃用)
 */
export default class cmd_api_event_market_type extends puremvc.SimpleCommand {
    private requestData: any;

    execute(notification: puremvc.INotification) {
        const body = (this.requestData = notification.getBody() || {});
        const url = Utils.getUrl(net.HttpType.api_event_market_type, body);
        Http.post(url, body).then(<any>this.response.bind(this));
    }

    private response(result: vo.ResponseVO) {
        if (result.status === 0) {
            if(typeof result.data == "object") result.data.requestData = this.requestData;
            this.sendNotification(net.EventType.api_event_market_type, result.data, result.unique);
        }
    }
}
