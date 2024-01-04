import dialog_message_box from "../views/dialog_message_box";
import LangUtil from "@/core/global/LangUtil";

export default class RequestErrorCMD extends puremvc.SimpleCommand {
    execute(notification: puremvc.INotification) {
        const body = notification.getBody();
        dialog_message_box.alert({
            message: LangUtil("请检查网络"),
            okFun: () => {
                location.reload();
            },
        });
    }
}
