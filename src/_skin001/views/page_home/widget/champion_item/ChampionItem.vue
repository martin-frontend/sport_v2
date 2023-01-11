<template src="./ChampionItem.vue.html" lang="html"></template>
<style src="./ChampionItem.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import BtnFixedBet from "../btn_fixed_bet/BtnFixedBet.vue";
import ChampionItem from "./ChampionItem";

@Component({
    components:{
        BtnFixedBet
    }
})
export default class extends ChampionItem {}
</script>
