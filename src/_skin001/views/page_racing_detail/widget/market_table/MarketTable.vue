<template src="./MarketTable.vue.html" lang="html"></template>
<style src="./MarketTable.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import MarketTable from "./MarketTable";
import Price from "../price/Price.vue";

@Component({
    components: {
        Price,
    },
})
export default class extends MarketTable {}
</script>
