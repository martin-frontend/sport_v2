import LangUtil from "@/core/global/LangUtil";
import net from "@/net/setting";
import MessageVO from "@/vo/MessageVO";
import Vue from "vue";
import OrderUnsettledProxy from "@/proxy/OrderUnsettledProxy";

export default class DialogConfirmSettlementProxy extends puremvc.Proxy {
    static NAME = "DialogConfirmSettlementProxy";

    pageData = {
        // bShow: false,
        data: <any>{},
        messageData: <MessageVO>{
            title: LangUtil("确认提前结算"),
            message: "",
            okFun: this.handlerOK,
            thisObj: this,
            cancelFun: this.handlerCancel,
            bConfirm: true,
        },
    };

    handlerOK() {
        // this.pageData.bShow = false;
        this.api_user_cashout();
    }

    handlerCancel() {
        // this.pageData.bShow = false;
    }

    set_cashout(data: any) {
        const keys = Object.keys(data);
        keys.forEach((key) => {
            if (data.order_no == key) {
                Object.assign(this.pageData.data, data[key]);
            }
        });
    }

    api_user_precashout() {
        const { order_no } = this.pageData.data;
        this.sendNotification(net.HttpType.api_user_precashout, { order_no });
    }

    api_user_cashout() {
        const { order_no, amount, price } = this.pageData.data;
        const order_list = [
            {
                order_no,
                amount,
                price,
            },
        ];
        this.sendNotification(net.HttpType.api_user_cashout, { order_list });
        Vue.notify({ group: "message", title: LangUtil("进入提前结算状态流程") });
    }
}
