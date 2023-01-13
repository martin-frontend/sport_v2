<template src="./MarketM3.vue.html" lang="html"></template>
<style src="./MarketM3.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import BtnFixedBet from "@/_skin001/views/page_home/widget/btn_fixed_bet/BtnFixedBet.vue";
import Component from "vue-class-component";
import MarketM3 from "./MarketM3";

@Component({
    components:{
        BtnFixedBet
    }
})
export default class extends MarketM3 {}
</script>
