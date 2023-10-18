import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import DialogConfirmSettlementMediator from "../mediator/DialogConfirmSettlementMediator";
import DialogConfirmSettlementProxy from "../proxy/DialogConfirmSettlementProxy";
import LangUtil from "@/core/global/LangUtil";
import BlurUtil from "@/core/global/BlurUtil";
import GlobalVar from "@/core/global/GlobalVar";
import { amountFormat } from "@/core/global/Functions";

@Component
export default class DialogConfirmSettlement extends AbstractView {
    LangUtil = LangUtil;
    myProxy: DialogConfirmSettlementProxy = this.getProxy(DialogConfirmSettlementProxy);
    pageData = this.myProxy.pageData;
    GlobalVar = GlobalVar;
    amountFormat = amountFormat;

    constructor() {
        super(DialogConfirmSettlementMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
