import DialogMount from "@/core/global/DialogMount";
import getProxy from "@/core/global/getProxy";
import SettingProxy from "@/proxy/SettingProxy";
import DialogSettingProxy from "./proxy/DialogSettingProxy";
import DialogSetting from "./views/DialogSetting.vue";

function show() {
    // DialogMount(DialogSetting);
    // const proxy: DialogSettingProxy = getProxy(DialogSettingProxy);
    // proxy.pageData.bShow = true;
    const proxy: SettingProxy = getProxy(SettingProxy);
    proxy.pageData.bShow = true;
}

export default { show };
