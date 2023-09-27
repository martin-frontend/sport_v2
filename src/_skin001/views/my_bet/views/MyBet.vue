<template src="./MyBet.vue.html" lang="html"></template>
<style src="./MyBet.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Nodata from "../../widget/nodata/Nodata.vue";
import BetItem from "../widget/bet_item/BetItem.vue";
import BetSummary from "../widget/bet_summary/BetSummary.vue";
import MyBet from "./MyBet";

@Component({
    components: {
        BetItem,
        Nodata,
        BetSummary,
    },
})
export default class extends MyBet {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
