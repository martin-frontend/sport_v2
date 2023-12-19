<template src="./RacingPanel.vue.html" lang="html"></template>
<style src="./RacingPanel.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import RacingPanel from "./RacingPanel";
import Nodata from "../../widget/nodata/Nodata.vue";
import CountdownTime from "../../page_racing_home/widget/countdown_time/CountdownTime.vue";

@Component({
    components: {
        Nodata,
        CountdownTime,
    },
})
export default class extends RacingPanel {}
</script>
