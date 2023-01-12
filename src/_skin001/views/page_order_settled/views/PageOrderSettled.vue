<template src="./PageOrderSettled.vue.html" lang="html"></template>
<style src="./PageOrderSettled.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import PageOrderSettled from "./PageOrderSettled";

@Component
export default class extends PageOrderSettled {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
