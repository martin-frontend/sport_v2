import DialogMount from "@/core/global/DialogMount";
import getProxy from "@/core/global/getProxy";
import DialogSettingProxy from "./proxy/DialogSettingProxy";
import DialogSetting from "./views/DialogSetting.vue";

function show() {
    DialogMount(DialogSetting);
    const proxy: DialogSettingProxy = getProxy(DialogSettingProxy);
    proxy.pageData.bShow = true;
}

export default { show };
