import Http from "@/core/Http";
import Utils from "@/core/Utils";
import net from "./setting";
import { vo } from "./vo";
/**
 * 顶部菜单
 */
export default class cmd_api_menu_nav extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification) {
        const body = notification.getBody() || {};
        const url = Utils.getUrl(net.HttpType.api_menu_nav, body);
        Http.post(url, body).then(<any>this.response.bind(this));
    }

    private response(result: vo.ResponseVO) {
        if (result.status === 0) {
            this.sendNotification(net.EventType.api_menu_nav, result.data, result.unique);
        }
    }
}
