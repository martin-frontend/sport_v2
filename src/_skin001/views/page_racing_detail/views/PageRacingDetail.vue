<template src="./PageRacingDetail.vue.html" lang="html"></template>
<style src="./PageRacingDetail.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import PageRacingDetail from "./PageRacingDetail";
import Nodata from "../../widget/nodata/Nodata.vue";
import CountdownTime from "../../page_racing_home/widget/countdown_time/CountdownTime.vue";
import ResultTable from "../widget/result_table/ResultTable.vue";
import MarketTable from "../widget/market_table/MarketTable.vue";
import LivePlayer from "../../live_player/views/LivePlayer.vue";

@Component({
    components: {
        Nodata,
        CountdownTime,
        ResultTable,
        MarketTable,
        LivePlayer
    },
})
export default class extends PageRacingDetail {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
