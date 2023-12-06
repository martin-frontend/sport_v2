<template src="./HeaderNav.vue.html" lang="html"></template>
<style src="./HeaderNav.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import HeaderNav from "./HeaderNav";

Component
export default class extends HeaderNav {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
