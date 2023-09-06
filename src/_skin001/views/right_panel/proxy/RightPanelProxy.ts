export default class RightPanelProxy extends puremvc.Proxy {
    static NAME = "RightPanelProxy";

    pageData = {
        //控制直播的标签
        liveIndex: 0,
        //是否显示直播列表
        isShowLiveList: false,
    };
    isShowLive = true;
}
