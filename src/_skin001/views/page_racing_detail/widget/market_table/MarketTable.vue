<template src="./MarketTable.vue.html" lang="html"></template>
<style src="./MarketTable.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import MarketTable from "./MarketTable";
import Price from "../price/Price.vue";
import BtnFixedBet from "../btn_fixed_bet/BtnFixedBet.vue";

@Component({
    components: {
        Price,
        BtnFixedBet,
    },
})
export default class extends MarketTable {}
</script>
