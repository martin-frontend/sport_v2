<template src="./PageOrderDetail.vue.html" lang="html"></template>
<style src="./PageOrderDetail.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import PageOrderDetail from "./PageOrderDetail";
import Overlay from "@/views/widget/overlay/Overlay.vue";

@Component({
    components: {
        Overlay,
    },
})
export default class extends PageOrderDetail {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
