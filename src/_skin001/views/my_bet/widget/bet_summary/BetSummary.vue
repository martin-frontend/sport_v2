<template src="./BetSummary.vue.html" lang="html"></template>
<style src="../bet_item/BetItem.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import BetSummary from "./BetSummary";
import LeeSwitch from "@/_skin001/views/widget/lee_switch/LeeSwitch.vue";

@Component({
    components: {
        LeeSwitch,
    },
})
export default class extends BetSummary {}
</script>
