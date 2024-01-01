import gsap, { Linear, Power1 } from "gsap";

function pageOpenAnim(obj: any, onComplete: any = null, duration: number = 0.3) {
    if (obj) {
        return gsap.from(obj, {
            xPercent: 200,
            duration: duration,
            ease: Power1.easeIn,
            onComplete: () => {
                onComplete && onComplete();
            },
        });
    } else {
        onComplete && onComplete();
    }
}
function pageCloseAnim(obj: any, onComplete: any = null, duration: number = 0.3) {
    if (obj) {
        return gsap.to(obj, {
            xPercent: 200,
            duration: duration,
            ease: Power1.easeInOut,
            onComplete: () => {
                onComplete && onComplete();
            },
        });
    } else {
        onComplete && onComplete();
    }
}

const AnimationEffect = {
    pageOpenAnim,
    pageCloseAnim,
};

export default AnimationEffect;
