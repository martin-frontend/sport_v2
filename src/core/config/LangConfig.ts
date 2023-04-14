import axios from "axios";
import { getFileVersion } from "../global/Functions";
import GlobalVar from "../global/GlobalVar";
import MD5 from "../global/MD5";
import NotificationName from "../NotificationName";
export default class LangConfig {
    //语言包
    static config: any;

    static load(lang: string, notsendEnd?: boolean) {
        const file_name = MD5.createInstance().hex_md5(`plat-${GlobalVar.plat_id}-${GlobalVar.lang}-1`);
        const url = `${GlobalVar.cdnUrl}/language_web/${file_name}.json?` + getFileVersion();
        return axios
            .create()
            .get(url)
            .then((response: any) => {
                this.config = response.data;
                if (!notsendEnd) {
                    puremvc.Facade.getInstance().sendNotification(NotificationName.LANG_CONFIG);
                }
            })
            .catch(() => {
                alert("Failed to get language pack");
                // window.location.reload();
            });
    }
}
