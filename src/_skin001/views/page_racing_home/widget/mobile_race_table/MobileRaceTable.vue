<template src="./MobileRaceTable.vue.html" lang="html"></template>
<style src="./MobileRaceTable.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import MobileRaceTable from "./MobileRaceTable";
import Nodata from "../../../widget/nodata/Nodata.vue";
import CountdownTime from "../countdown_time/CountdownTime.vue";

@Component({
    components: {
        Nodata,
        CountdownTime,
    },
})
export default class extends MobileRaceTable {}
</script>
