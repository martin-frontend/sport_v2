import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import ScrollUtil from "@/core/global/ScrollUtil";
import gsap, { Linear } from "gsap";

@Component
export default class HorizontalScroll extends AbstractView {
    LangUtil = LangUtil;

    @Prop({default: 0}) offsetx!:number;

    //拖动参数
    dragData = {
        isMoving: false,
        x: 0,
        left: 0,
    };

    onMouseDown(event: any) {
        this.dragData.isMoving = true;
        this.dragData.x = event.pageX;
        //@ts-ignore
        const divbox: HTMLElement = this.$refs.divbox;
        this.dragData.left = divbox.scrollLeft;
    }
    onMouseUp(event: any) {
        var distanceX = event.pageX - this.dragData.x;
        if (Math.abs(distanceX) > 0) {
            setTimeout(() => {
                this.dragData.isMoving = false;
            }, 100);
        } else {
            this.dragData.isMoving = false;
            const offsetLeft = event.target.offsetLeft;
            const targetWidth = event.target.offsetWidth;

            const divbox: HTMLElement = <any>this.$refs.divbox;
            if (divbox.scrollLeft > offsetLeft) {
                gsap.to(divbox, {
                    duration: 0.2,
                    scrollLeft: offsetLeft - this.offsetx,
                    ease: Linear.easeNone,
                });
            } else if (divbox.scrollLeft + divbox.offsetWidth - targetWidth < offsetLeft) {
                gsap.to(divbox, {
                    duration: 0.2,
                    scrollLeft: offsetLeft - divbox.offsetWidth + targetWidth - this.offsetx,
                    ease: Linear.easeNone,
                });
            }
        }
    }
    onMouseMove(event: any) {
        if (this.dragData.isMoving) {
            //@ts-ignore
            const divbox: HTMLElement = this.$refs.divbox;
            var distanceX = event.pageX - this.dragData.x;
            divbox.scrollLeft = this.dragData.left - distanceX;
        }
    }
}
