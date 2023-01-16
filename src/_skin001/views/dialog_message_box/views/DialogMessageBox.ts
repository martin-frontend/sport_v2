import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import DialogMessageBoxMediator from "../mediator/DialogMessageBoxMediator";
import DialogMessageBoxProxy from "../proxy/DialogMessageBoxProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class DialogMessageBox extends AbstractView {
    LangUtil = LangUtil;
    myProxy: DialogMessageBoxProxy = this.getProxy(DialogMessageBoxProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(DialogMessageBoxMediator);
        this.$vuetify.breakpoint.mobile
    }

    onOK() {
        this.myProxy.handlerOK();
    }

    onCancel() {
        this.myProxy.handlerCancel();
    }
}
