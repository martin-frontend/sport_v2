<template src="./DialogBetResult.vue.html" lang="html"></template>
<style src="./DialogBetResult.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import DialogBetResult from "./DialogBetResult";
import BetResult from "../widget/bet_result/BetResult.vue";

@Component({
    components: {
        BetResult,
    },
})
export default class extends DialogBetResult {
    
}
</script>
