<template src="./PageOrderUnsettled.vue.html" lang="html"></template>
<style src="./PageOrderUnsettled.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import PageOrderUnsettled from "./PageOrderUnsettled";
import ParlayOrder from "../widget/parlay_order/ParlayOrder.vue";

@Component({
    components: { ParlayOrder },
})
export default class extends PageOrderUnsettled {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
