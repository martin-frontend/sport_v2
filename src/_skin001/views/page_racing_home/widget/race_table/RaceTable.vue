<template src="./RaceTable.vue.html" lang="html"></template>
<style src="./RaceTable.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import RaceTable from "./RaceTable";
import Nodata from "../../../widget/nodata/Nodata.vue";
import CountdownTime from "../countdown_time/CountdownTime.vue";

@Component({
    components: {
        Nodata,
        CountdownTime,
    },
})
export default class extends RaceTable {}
</script>
