<template src="./Navigation.vue.html" lang="html"></template>
<style src="./Navigation.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Navigation from "./Navigation";

@Component
export default class extends Navigation {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
