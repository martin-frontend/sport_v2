<template src="./BetItem.vue.html" lang="html"></template>
<style src="./BetItem.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import BetItem from "./BetItem";
import LeeSwitch from "@/_skin001/views/widget/lee_switch/LeeSwitch.vue";

@Component({
    components: {
        LeeSwitch,
    },
})
export default class extends BetItem {}
</script>
