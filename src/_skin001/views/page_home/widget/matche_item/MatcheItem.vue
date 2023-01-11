<template src="./MatcheItem.vue.html" lang="html"></template>
<style src="./MatcheItem.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import BtnFixedBet from "../btn_fixed_bet/BtnFixedBet.vue";
import Component from "vue-class-component";
import MatcheItem from "./MatcheItem";

@Component({
    components:{
        BtnFixedBet
    }
})
export default class extends MatcheItem {}
</script>
