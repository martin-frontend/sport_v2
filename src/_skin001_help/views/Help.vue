<template src="./Help.vue.html" lang="html"></template>
<style src="./Help.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Help from "./Help";
import HorizontalScroll from "@/_skin001/views/widget/horizontal_scroll/HorizontalScroll.vue"//"./views/widget/horizontal_scroll/HorizontalScroll.vue";

@Component({
    components: {
        HorizontalScroll
    },
})
export default class extends Help {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
