import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
// import page_orders from "../../page_orders";
import { EnumFixOrderStatus } from "@/enum/EnumFixOrderStatus";

@Component
export default class NotifyOrderFinished extends AbstractView {
    LangUtil = LangUtil;
    EnumFixOrderStatus = EnumFixOrderStatus;

    animation = {
        enter: {
            opacity: [1, 0],
            translateX: [0, 300],
            scale: [1, 0.2],
        },
        leave: {
            opacity: 0,
            height: 0,
        },
    };
    animation1 = {
        enter: {
            opacity: [1, 0],
            // scaleY: [1, 0.2],
            translateY: [0, -36],
        },
        leave: {
            opacity: 0,
            height: 0,
        },
    };

    goPageOrder(props: any) {
        if (props.item.data.status != 0 && props.item.data.status != 1) {
            props.close();
            // if (this.$vuetify.breakpoint.mobile) page_orders.showSettle(1);
        }
    }
}
