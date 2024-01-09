<template src="./RightPanel.vue.html" lang="html"></template>
<style src="./RightPanel.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Live from "../../live/views/Live.vue";
import LiveList from "../../live_list/views/LiveList.vue";
import Matche from "../../matche/views/Matche.vue";
import RacingPanel from "../../racing_panel/views/RacingPanel.vue";
import RightPanel from "./RightPanel";
// import LivePlayer from "@/_skin001/views/live_player/views/LivePlayer.vue";

@Component({
    components: {
        Live,
        Matche,
        LiveList,
        // LivePlayer,
        RacingPanel
    },
})
export default class extends RightPanel {}
</script>
