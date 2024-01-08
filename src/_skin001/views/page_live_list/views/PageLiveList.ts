import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import PageLiveListMediator from "../mediator/PageLiveListMediator";
import PageLiveListProxy from "../proxy/PageLiveListProxy";
import LangUtil from "@/core/global/LangUtil";
import page_matche from "../../page_matche";
import AnimationEffect from "@/core/AnimationEffect";
@Component
export default class PageLiveList extends AbstractView {
    LangUtil = LangUtil;
    myProxy: PageLiveListProxy = this.getProxy(PageLiveListProxy);
    pageData = this.myProxy.pageData;

    constructor() {
        super(PageLiveListMediator);
    }

    onChange(item: any) {
        page_matche.show(item.id);
    }

    onBack() {
        // this.$router.back();
        if (this.$vuetify.breakpoint.mobile) {
            AnimationEffect.pageCloseAnim(this.$refs.movediv, () => {
                this.$router.back();
            });
        } else this.$router.back();
    }
    mounted() {
        this.pageAnim();
    }
    pageAnim() {
        this.$nextTick(() => {
            if (this.$vuetify.breakpoint.mobile) {
                AnimationEffect.pageOpenAnim(this.$refs.movediv);
            }
        });
    }
    destroyed() {
        super.destroyed();
    }
}
