import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import LiveListMediator from "../mediator/LiveListMediator";
import LiveListProxy from "../proxy/LiveListProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class LiveList extends AbstractView {
    LangUtil = LangUtil;
    myProxy: LiveListProxy = this.getProxy(LiveListProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(LiveListMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
