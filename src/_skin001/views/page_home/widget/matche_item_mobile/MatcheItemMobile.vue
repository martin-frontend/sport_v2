<template src="./MatcheItemMobile.vue.html" lang="html"></template>
<style src="./MatcheItemMobile.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import BtnFixedBet from "../btn_fixed_bet/BtnFixedBet.vue";
import MatcheItemMobile from "./MatcheItemMobile";

@Component({
    components: {
        BtnFixedBet,
    },
})
export default class extends MatcheItemMobile {}
</script>
