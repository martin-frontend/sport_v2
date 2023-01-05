<template src="./PageHome.vue.html" lang="html"></template>
<style src="./PageHome.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import PageHome from "./PageHome";

@Component
export default class extends PageHome {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
