<template src="./RightPanel.vue.html" lang="html"></template>
<style src="./RightPanel.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Live from "../../live/views/Live.vue";
import LiveList from "../../live_list/views/LiveList.vue";
import Matche from "../../matche/views/Matche.vue";
import RightPanel from "./RightPanel";

@Component({
    components: {
        Live,
        Matche,
        LiveList,
    },
})
export default class extends RightPanel {}
</script>
