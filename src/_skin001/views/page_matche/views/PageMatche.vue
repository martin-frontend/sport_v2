<template src="./PageMatche.vue.html" lang="html"></template>
<style src="./PageMatche.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import ScrollUtil from "@/core/global/ScrollUtil";
import Component from "vue-class-component";
import Live from "../../live/views/Live.vue";
import Matche from "../../matche/views/Matche.vue";
import PageMatche from "./PageMatche";

@Component({
    components: {
        Live,
        Matche,
    },
})
export default class extends PageMatche {
    mounted() {
        const routerBox = document.getElementById("routerBox");
        ScrollUtil(routerBox, 0);
    }
}
</script>
