<template src="./PageRacingHome.vue.html" lang="html"></template>
<style src="./PageRacingHome.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import PageRacingHome from "./PageRacingHome";
import RaceTable from "../widget/race_table/RaceTable.vue";
import MobileRaceTable from "../widget/mobile_race_table/MobileRaceTable.vue";
import Nodata from "../../widget/nodata/Nodata.vue";
import EventFilter from "../widget/event_filter/EventFilter.vue";

@Component({
    components: {
        RaceTable,
        MobileRaceTable,
        Nodata,
        EventFilter,
    },
})
export default class extends PageRacingHome {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
