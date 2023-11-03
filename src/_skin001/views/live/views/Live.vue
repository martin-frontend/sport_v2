<template src="./Live.vue.html" lang="html"></template>
<style src="./Live.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Live from "./Live";
import CardRed from "../../widget/card_red/CardRed.vue";
import CardYellow from "../../widget/card_yellow/CardYellow.vue";
import LivePlayer from "../../live_player/views/LivePlayer.vue";

@Component({
    components: {
        LivePlayer,
        CardRed,
        CardYellow,
    },
})
export default class extends Live {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
