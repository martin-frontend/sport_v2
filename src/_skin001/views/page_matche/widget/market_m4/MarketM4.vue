<template src="./MarketM4.vue.html" lang="html"></template>
<style src="./MarketM4.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import BtnFixedBet from "@/_skin001/views/page_home/widget/btn_fixed_bet/BtnFixedBet.vue";
import Component from "vue-class-component";
import MarketM4 from "./MarketM4";

@Component({
    components:{
        BtnFixedBet
    }
})
export default class extends MarketM4 {}
</script>
