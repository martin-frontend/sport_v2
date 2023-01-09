<template src="./BetSlipUnsettled.vue.html" lang="html"></template>
<style src="./BetSlipUnsettled.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import BetSlipUnsettled from "./BetSlipUnsettled";

@Component
export default class extends BetSlipUnsettled {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
