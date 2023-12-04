<template src="./PageRacingDetail.vue.html" lang="html"></template>
<style src="./PageRacingDetail.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import PageRacingDetail from "./PageRacingDetail";

@Component
export default class extends PageRacingDetail {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
