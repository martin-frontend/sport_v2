<template src="./RacingPanel.vue.html" lang="html"></template>
<style src="./RacingPanel.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import RacingPanel from "./RacingPanel";

@Component
export default class extends RacingPanel {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
