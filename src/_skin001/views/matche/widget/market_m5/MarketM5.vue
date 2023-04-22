<template src="./MarketM5.vue.html" lang="html"></template>
<style src="./MarketM5.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import BtnFixedBet from "@/_skin001/views/page_home/widget/btn_fixed_bet/BtnFixedBet.vue";
import Component from "vue-class-component";
import MarketM5 from "./MarketM5";

@Component({
    components: {
        BtnFixedBet,
    },
})
export default class extends MarketM5 {}
</script>
