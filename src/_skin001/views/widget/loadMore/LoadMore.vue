<template src="./LoadMore.vue.html" lang="html"></template>
<style src="./LoadMore.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Nodata from "../nodata/Nodata.vue";
import LoadMore from "./LoadMore";

@Component({
    components: {
        Nodata,
    },
})
export default class extends LoadMore {}
</script>
