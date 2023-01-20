import net from "@/net/setting";
import axios from "axios";
import GlobalVar from "./global/GlobalVar";

const facade = puremvc.Facade.getInstance();
axios.defaults.baseURL = process.env.VUE_APP_BASE_API;

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

// 添加请求拦截器
axios.interceptors.request.use(
    function (config) {
        if (GlobalVar.token) config.data.token = GlobalVar.token;
        config.data.lang = GlobalVar.lang || "en_US";
        if (GlobalVar.plat_id) config.data.plat_id = GlobalVar.plat_id;
        if (GlobalVar.device_type) config.data.device_type = GlobalVar.device_type;
        config.data.timezone = GlobalVar.zone;
        facade.sendNotification(net.EventType.REQUEST_START, config);
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

// 添加响应拦截器
axios.interceptors.response.use(
    function (response: any) {
        facade.sendNotification(net.EventType.REQUEST_END, response);
        return response.data;
    },
    function (error) {
        facade.sendNotification(net.EventType.REQUEST_ERROR, error);
        return Promise.reject(error);
    }
);

function get(url: string, data?: any) {
    if (data) {
        const queryStr = Object.keys(data)
            .map((key) => `${key}=${encodeURIComponent(data[key])}`)
            .join("&");
        url += "?" + queryStr;
    }
    return axios.get(url);
}

function post(url: string, data?: any) {
    return axios.post(url, data, { cancelToken: GlobalVar.tokenExpired ? source.token : undefined });
}

const Http = {
    get,
    post,
};

export default Http;
