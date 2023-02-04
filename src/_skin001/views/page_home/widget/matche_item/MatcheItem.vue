<template src="./MatcheItem.vue.html" lang="html"></template>
<style src="./MatcheItem.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import BtnFixedBet from "../btn_fixed_bet/BtnFixedBet.vue";
import Component from "vue-class-component";
import MatcheItem from "./MatcheItem";
import CardRed from "@/_skin001/views/widget/card_red/CardRed.vue";
import CardYellow from "@/_skin001/views/widget/card_yellow/CardYellow.vue";

@Component({
    components: {
        BtnFixedBet,
        CardRed,
        CardYellow,
    },
})
export default class extends MatcheItem {}
</script>
