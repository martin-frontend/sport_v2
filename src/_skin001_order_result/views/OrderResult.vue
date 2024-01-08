<template src="./OrderResult.vue.html" lang="html"></template>
<style src="./OrderResult.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import OrderResult from "./OrderResult";
@Component({
    components: {},
})
export default class extends OrderResult {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
