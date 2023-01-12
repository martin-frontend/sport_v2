import axios from "axios";
import { getFileVersion } from "@/core/global/Functions";
import GlobalVar from "@/core/global/GlobalVar";
import MD5 from "@/core/global/MD5";
import net from "@/net/setting";
import NotificationName from "@/core/NotificationName";
import AppFacade from "@/_skin001_competion_result/AppFacade";
export default class LangConfig extends puremvc.Proxy {
    //语言包
    static config: any;
    AppFacade = AppFacade;
    static load(lang: string) {
        const file_name = MD5.createInstance().hex_md5(`plat-${GlobalVar.plat_id}-${GlobalVar.lang}-1`);
        const url = `${GlobalVar.cdnUrl}/language_web/${file_name}.json?` + getFileVersion();
        return axios
            .create()
            .get(url)
            .then((response: any) => {
                this.config = response.data;
                if (GlobalVar.token) {
                    GlobalVar.loading = true;
                

                }
            })
            .catch(() => {
                alert("语言包获取失败");
                // window.location.reload();
            });
    }

}
