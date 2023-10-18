import DialogMount from "@/core/global/DialogMount";
import getProxy from "@/core/global/getProxy";
import MessageVO from "@/vo/MessageVO";
import DialogConfirmSettlementProxy from "./proxy/DialogConfirmSettlementProxy";
import DialogConfirmSettlement from "./views/DialogConfirmSettlement.vue";
import DialogMessageBoxProxy from "../dialog_message_box/proxy/DialogMessageBoxProxy";

function show(data: any) {
    DialogMount(DialogConfirmSettlement);
    const myProxy: DialogConfirmSettlementProxy = getProxy(DialogConfirmSettlementProxy);
    const messageBoxProxy: DialogMessageBoxProxy = getProxy(DialogMessageBoxProxy);
    Object.assign(myProxy.pageData.data, data);
    messageBoxProxy.pageData.bShow = true;
    // myProxy.pageData.bShow = true;
    messageBoxProxy.pageData.data = { ...myProxy.pageData.messageData };
    myProxy.api_user_precashout();
}

export default { show };
