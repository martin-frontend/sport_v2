import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";

@Component
export default class NotifyMessage extends AbstractView {
    LangUtil = LangUtil;

    animation = {
        enter: {
            opacity: [1, 0],
            scale: [1, 0.2],
        },
        leave: {
            opacity: 0,
            height: 0,
        },
    };
}
