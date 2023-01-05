import GlobalVar from "@/core/global/GlobalVar";

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
    }
}
