<template src="./PageMatche.vue.html" lang="html"></template>
<style src="./PageMatche.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import PageMatche from "./PageMatche";

@Component
export default class extends PageMatche {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
