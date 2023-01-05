import GlobalVar from "@/core/global/GlobalVar";

export default class RequestStartCMD extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification) {
        const body = notification.getBody();
        if (GlobalVar.token) body.data.token = GlobalVar.token;
        if (GlobalVar.lang) body.data.lang = GlobalVar.lang;
        if (GlobalVar.plat_id) body.data.plat_id = GlobalVar.plat_id;
        if (GlobalVar.device_type) body.data.device_type = GlobalVar.device_type;
        console.group("%c http send >>> " + body.url, "color:#ccc;");
        console.log(body.data);
        console.groupEnd();
    }
}
