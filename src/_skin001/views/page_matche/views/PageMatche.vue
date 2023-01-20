<template src="./PageMatche.vue.html" lang="html"></template>
<style src="./PageMatche.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Live from "../../live/views/Live.vue";
import Matche from "../../matche/views/Matche.vue";
import PageMatche from "./PageMatche";

@Component({
    components: {
        Live,
        Matche,
    }
})
export default class extends PageMatche {
}
</script>
