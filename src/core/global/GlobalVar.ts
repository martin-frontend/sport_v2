const GlobalVar = {
    /**版本号 */
    version: process.env.version,
    /**平台 */
    plat_id: "",
    /**装置类型 */
    device_type: 3,
    /**cdn地址 */
    cdnUrl: "",
    /**语言 */
    lang: "zh_CN",
    /**用户认证token */
    token: "",
    /**token是否过期 */
    tokenExpired: false,
    /**API地址 */
    host: "",
    /**服务器时间 */
    server_time: 0,
    /**盘口设置 */
    MarketType_area: "0",
    /**是否显示全局loading */
    loading: false,
    loading1: false, // 显示不可见的loading层
    /**用户名显示 */
    displayname:'',
    /**时区 */
    zone: "",
    /**币种 */
    currency: "",
    /**手机模式下，是否显示导航 */
    navDrawer: false,
};

export default GlobalVar;
