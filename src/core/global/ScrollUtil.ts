import gsap, { Linear } from "gsap";

export default function (obj: any, targetOffsetTop: number, duration: number = 0.3) {
    gsap.to(obj, {
        duration,
        scrollTop: targetOffsetTop,
        ease: Linear.easeNone,
    });
}
