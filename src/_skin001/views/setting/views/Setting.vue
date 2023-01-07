<template src="./Setting.vue.html" lang="html"></template>
<style src="./Setting.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Setting from "./Setting";

@Component
export default class extends Setting {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
