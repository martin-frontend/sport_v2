import axios from "axios";
import { getFileVersion } from "../global/Functions";
import GlobalVar from "../global/GlobalVar";
import MD5 from "../global/MD5";
import NotificationName from "../NotificationName";
import axiosRetry from "axios-retry";
export default class LangConfig {
    //语言包
    static config: any;

    static load(lang: string, notsendEnd?: boolean) {
        const file_name = MD5.createInstance().hex_md5(`plat-${GlobalVar.plat_id}-${GlobalVar.lang}-1`);
        const url = `${GlobalVar.cdnUrl}/language_web/${file_name}.json?` + getFileVersion();

        const myAxios = axios.create();
        // 配置 axios-retry 插件
        axiosRetry(myAxios, {
            retries: 3, // 重试次数
            retryDelay: (retryCount) => {
                // 指数退避算法
                // return retryCount * 1000;
                return 1000;
            },
            retryCondition: (error) => {
                // 仅在出现网络错误或 5xx 响应时重试
                return axiosRetry.isNetworkError(error) || axiosRetry.isRetryableError(error);
            },
        });

        return myAxios
            .get(url)
            .then((response: any) => {
                this.config = response.data;
                if (!notsendEnd) {
                    puremvc.Facade.getInstance().sendNotification(NotificationName.LANG_CONFIG);
                }
            })
            .catch(() => {
                alert("Failed to get language pack");
                window.location.reload();
            });
    }
}
