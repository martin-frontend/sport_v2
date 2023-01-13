<template src="./PageMatche.vue.html" lang="html"></template>
<style src="./PageMatche.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Live from "../../live/views/Live.vue";
import Nodata from "../../widget/nodata/Nodata.vue";
import MarketM1 from "../widget/market_m1/MarketM1.vue";
import MarketM2 from "../widget/market_m2/MarketM2.vue";
import MarketM3 from "../widget/market_m3/MarketM3.vue";
import MarketM4 from "../widget/market_m4/MarketM4.vue";
import MarketM5 from "../widget/market_m5/MarketM5.vue";
import MarketM6 from "../widget/market_m6/MarketM6.vue";
import MarketM7 from "../widget/market_m7/MarketM7.vue";
import OtherCompetition from "../widget/other_Competition/OtherCompetition.vue";
import PageMatche from "./PageMatche";

@Component({
    components: {
        Nodata,
        MarketM1,
        MarketM2,
        MarketM3,
        MarketM4,
        MarketM5,
        MarketM6,
        MarketM7,
        OtherCompetition,
        Live,
    },
})
export default class extends PageMatche {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
