<template src="./PageOrder.vue.html" lang="html"></template>
<style src="./PageOrder.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import PageOrder from "./PageOrder";
import ParlayOrder from "../widget/parlay_order/ParlayOrder.vue";

@Component({
    components: {
        ParlayOrder,
    },
})
export default class extends PageOrder {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
