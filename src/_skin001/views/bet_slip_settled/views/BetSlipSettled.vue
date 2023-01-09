<template src="./BetSlipSettled.vue.html" lang="html"></template>
<style src="./BetSlipSettled.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import BetSlipSettled from "./BetSlipSettled";

@Component
export default class extends BetSlipSettled {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
