<template src="./PageGameResults.vue.html" lang="html"></template>
<style src="./PageGameResults.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import PageGameResults from "./PageGameResults";
import Nodata from "@/_skin001/views/widget/nodata/Nodata.vue";
@Component({
    components: {
        Nodata,
    },
})
export default class extends PageGameResults {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
