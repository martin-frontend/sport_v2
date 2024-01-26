import AbstractView from "@/core/abstract/AbstractView";
import LangUtil from "@/core/global/LangUtil";
import { Prop, Watch, Component } from "vue-property-decorator";
import SVGA from "svgaplayerweb"; // https://github.com/svga/SVGAPlayer-Web/blob/master/README.zh.md
import GlobalVar from "@/core/global/GlobalVar";

@Component
export default class SvgaPlayer extends AbstractView {
    @Prop() id!: any;
    @Prop() src!: any; // 资源路径
    @Prop() styleObj!: any;
    @Prop({ default: 0 }) loops!: any; // 动画循环次数，默认值为 0，表示无限循环
    @Prop() onFrame!: any; // 动画播放至某帧后回调
    @Prop() onFinished!: any; // 动画停止播放时回调
    @Prop({ default: "AspectFill" }) mode!: any; // 设置动画的拉伸模式，可选 "Fill" | "AspectFill" | "AspectFit"

    LangUtil = LangUtil;
    // player: any = null;
    player!: SVGA.Player;
    parser!: SVGA.Parser;

    mounted() {
        this.initMachineSVGA();
    }

    // @Watch("src")
    // onChangeSrc() {
    //     console.warn('clear');

    //     this.player.clear();
    //     this.initMachineSVGA();
    // }

    clear() {
        if (this.player) {
            this.player.clear();
        }
    }
    async initMachineSVGA() {
        // console.warn('initMachineSVGA', this.src);
        this.$nextTick(() => {
            const id = "#svga-player-" + this.id;
            if (!this.player) this.player = new SVGA.Player(id);
            // if (!this.player) {
            //     this.player = player;
            // }
            this.player.loops = this.loops;
            this.player.clearsAfterStop = false; // 默认值为 true，表示当动画结束时，清空画布。
            // @ts-ignore
            if (!this.parser) this.parser = new SVGA.Parser(id);
            const newSrc = `${this.src}?${GlobalVar.version}`;
            this.parser.load(
                newSrc,
                (videoItem) => {
                    this.player.setVideoItem(videoItem);
                    this.player.setContentMode(this.mode);
                    this.player.startAnimation();
                    this.player.onFinished(() => this.onFinished?.());
                    this.player.onFrame((frame) => this.onFrame?.(frame));
                },
                (error: Error) => console.warn("svga-player error", error)
            );
        });
    }
}
