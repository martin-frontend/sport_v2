import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageRacingHomeMediator from "../mediator/PageRacingHomeMediator";
import PageRacingHomeProxy from "../proxy/PageRacingHomeProxy";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class PageRacingHome extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageRacingHomeProxy = this.getProxy(PageRacingHomeProxy);
    pageData = this.myProxy.pageData;

    tab = "today";

    tabOptions = [
        { title: "下一场", key: "next" },
        { title: "今天", key: "today" },
        { title: "明天", key: "tomorrow" },
        { title: "後天", key: "date" },
    ];

    checkBoxArr = ["h"];
    // checkBoxOptions = [
    //     { title: "赛马", key: "h", icon: "race" },
    //     { title: "赛狗", key: "d", icon: "greyhound_racing" },
    //     { title: "马车赛", key: "c", icon: "harness_racing" },
    // ];
    // get checkBoxOptionsByKeys() {
    //     const obj: any = {};
    //     this.checkBoxOptions.forEach((item) => {
    //         obj[item.key] = { ...item };
    //     });
    //     return obj;
    // }

    checkBoxOptions = {
        h: { title: "赛马", key: "h", icon: "race" },
        d: { title: "赛狗", key: "d", icon: "greyhound_racing" },
        c: { title: "马车赛", key: "c", icon: "harness_racing" },
    };

    onBack() {
        this.$router.back();
    }

    constructor() {
        super(PageRacingHomeMediator);
    }

    destroyed() {
        super.destroyed();
    }
}
