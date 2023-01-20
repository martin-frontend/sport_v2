<template src="./HomeMobileHeader.vue.html" lang="html"></template>
<style src="./HomeMobileHeader.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Navigation from "@/_skin001/views/navigation/views/Navigation.vue";
import Component from "vue-class-component";
import HomeMobileHeader from "./HomeMobileHeader";

@Component({
    components: {
        Navigation,
    },
})
export default class extends HomeMobileHeader {}
</script>
