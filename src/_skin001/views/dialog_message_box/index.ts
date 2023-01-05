import DialogMount from "@/core/global/DialogMount";
import getProxy from "@/core/global/getProxy";
import MessageVO from "@/vo/MessageVO";
import DialogMessageBoxProxy from "./proxy/DialogMessageBoxProxy";
import DialogMessageBox from "./views/DialogMessageBox.vue";

function show(data: MessageVO) {
    DialogMount(DialogMessageBox);
    const proxy: DialogMessageBoxProxy = getProxy(DialogMessageBoxProxy);
    proxy.pageData.bShow = true;
    proxy.pageData.data = data;
}

function confirm(data: string | MessageVO) {
    if (typeof data == "string") {
        show({ bConfirm: true, message: data });
    } else {
        data.bConfirm = true;
        show(data);
    }
}

function alert(data: string | MessageVO) {
    if (typeof data == "string") {
        show({ bConfirm: false, message: data });
    } else {
        data.bConfirm = false;
        show(data);
    }
}

export default { confirm, alert };
