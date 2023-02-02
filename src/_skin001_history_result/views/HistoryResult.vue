<template src="./HistoryResult.vue.html" lang="html"></template>
<style src="./HistoryResult.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import HistoryResult from "./HistoryResult";
@Component({
    components: {
    },
})
export default class extends HistoryResult {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
