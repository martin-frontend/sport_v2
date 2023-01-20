import DialogMount from "@/core/global/DialogMount";
import getProxy from "@/core/global/getProxy";
import DialogMyBetProxy from "./proxy/DialogMyBetProxy";
import DialogMyBet from "./views/DialogMyBet.vue";

function show() {
    DialogMount(DialogMyBet);
    const proxy: DialogMyBetProxy = getProxy(DialogMyBetProxy);
    proxy.pageData.bShow = true;
}

export default { show };
