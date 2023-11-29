<template src="./Navigation.vue.html" lang="html"></template>
<style src="./Navigation.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import BetResult from "../../dialog_bet_result/widget/bet_result/BetResult.vue";
import MyBet from "../../my_bet/views/MyBet.vue";
import PageOrderUnsettled from "../../page_order_unsettled/views/PageOrderUnsettled.vue";
import Navigation from "./Navigation";
import MarketTypeTag from "../widget/MarketTypeTag.vue";

@Component({
    components: {
        MyBet,
        PageOrderUnsettled,
        BetResult,
        MarketTypeTag,
    },
})
export default class extends Navigation {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
