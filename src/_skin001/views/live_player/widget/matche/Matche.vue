<template src="./Matche.vue.html" lang="html"></template>
<style src="./Matche.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Nodata from "../../../widget/nodata/Nodata.vue";
import MarketM1 from "../../../matche/widget/market_m1/MarketM1.vue";
import MarketM2 from "../../../matche/widget/market_m2/MarketM2.vue";
import MarketM3 from "../../../matche/widget/market_m3/MarketM3.vue";
import MarketM4 from "../../../matche/widget/market_m4/MarketM4.vue";
import MarketM5 from "../../../matche/widget/market_m5/MarketM5.vue";
import MarketM6 from "../../../matche/widget/market_m6/MarketM6.vue";
import MarketM7 from "../../../matche/widget/market_m7/MarketM7.vue";
import MarketM8 from "../../../matche/widget/market_m8/MarketM8.vue";
import Matche from "../../../matche/views/Matche";

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
        MarketM8,
    },
})
export default class extends Matche {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
