import Vue from "vue";
import GlobalVar from "@/core/global/GlobalVar";
import LangUtil from "@/core/global/LangUtil";
import { EnumPostMessage } from "@/enum/EnumPostMessage";
import dialog_message_box from "../views/dialog_message_box";
import net from "@/net/setting";
import PlatConfig from "@/core/config/PlatConfig";

export default class RequestEndCMD extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification) {
        const body = notification.getBody();
        const microtime = body.data.extend.microtime >> 0;
        if (microtime > GlobalVar.server_time) {
            GlobalVar.server_time = microtime;
        }
        console.group("%c http response >>> " + body.config.url, "color:#0f0;");
        console.log(JSON.parse(JSON.stringify(body.data)));
        console.groupEnd();

        const status = body.data.status;
        const ERROR_CODE = [
            1111002, 1111003, 1111004, 1111005, 1111001, 9999, 1111009, 10126, 10103, 1112003, 1112002, 10108, 1111015, 140000001,
            140000002, 140000003,
        ];
        if (status == 10124) {
            //用户被禁用
            if (PlatConfig.config) {
                dialog_message_box.alert({ message: body.data.msg });
            } else {
                alert(body.data.msg);
            }
        } else if (status === 10126) {
            // console.log("登陆已失效，请重新登陆");
            GlobalVar.tokenExpired = true;
            if (body.config.url == net.HttpType.api_config) {
                alert(body.data.msg);
            } else {
                dialog_message_box.alert({
                    message: LangUtil("闲置时间过长，请重新回到平台再次开启。"),
                    okFun: () => {
                        if (window.parent) {
                            window.parent.postMessage(EnumPostMessage.TOKEN_TIMEOUT, "*");
                        }
                    },
                });
            }
        } else if (status === 1112002) {
            // 该赛事不存在或已结束
            Vue.notify({ group: "message", title: body.data.msg });
            Vue.router.replace("/page_home");
            window.location.reload();
        } else if (status === 140000001 || status === 140000002 || status === 140000003) {
            console.warn(body.data.msg);
        } else if (ERROR_CODE.includes(status)) {
            Vue.notify({ group: "message", title: body.data.msg });
            GlobalVar.loading = false;
        } else if (status != 0) {
            Vue.notify({ group: "message", title: body.data.msg });
        }
    }
}
