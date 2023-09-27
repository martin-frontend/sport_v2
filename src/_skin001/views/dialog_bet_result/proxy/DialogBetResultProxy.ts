export default class DialogBetResultProxy extends puremvc.Proxy {
    static NAME = "DialogBetResultProxy";

    // pageData = {
    //     bShow: false,
    //     event_id: 0,
    //     stake: "",
    //     side: "",
    //     market_id: 0,
    //     market_type: "",
    //     selection_id: 0,
    //     odds: "",
    //     /**
    //       如果为0  頁面不要顯示"下注成功"的提示 。注單確認中
    //       如果为1 頁面彈出"注单编号: 2RMMXXX 下注成功"的提示
    //       如果为3 頁面彈出顯示"注单编号: 2RMMXXX 下注失敗"的提示
    //     */
    //     status: 0,
    //     statusMsg: "",
    //     order_no: "",
    //     partner_order: "", //平台订单号
    //     create_time: 0,
    //     // 投注时的赛事进程
    //     states_str: "",
    //     // 是否滚球
    //     isInPlay: false,
    //     //当前比分
    //     goals: "",

    //     //赛事相关信息
    //     matche: {},
    //     market: {},
    //     selection: {},
    // };
    pageData = {
        bShow: false,
        list: <any>[],
        requestData: <any>{},
        parlayData: <any>{
            status: 0,
            statusMsg: "",
            order_no: "",
            odds: "",
        },
    };
}
