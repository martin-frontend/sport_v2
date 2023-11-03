<template src="./LivePlayer.vue.html" lang="html"></template>
<style src="./LivePlayer.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import LivePlayer from "./LivePlayer";
//@ts-ignore
import VideoPlayer from "@liveqing/liveplayer";
import CardRed from "../../widget/card_red/CardRed.vue";
import CardYellow from "../../widget/card_yellow/CardYellow.vue";
import Matche from "../widget/matche/Matche.vue";
import BetItem from "../../my_bet/widget/bet_item/BetItem.vue";
import BetResult from "../../dialog_bet_result/widget/bet_result/BetResult.vue";
import NotifyMessage from "../../widget/notify_message/NotifyMessage.vue";
import NotifyOrderFinished from "../../widget/notify_order_finished/NotifyOrderFinished.vue";

@Component({
    components: {
        VideoPlayer,
        CardRed,
        CardYellow,
        Matche,
        BetItem,
        BetResult,
        NotifyMessage,
        NotifyOrderFinished,
    },
})
export default class extends LivePlayer {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
