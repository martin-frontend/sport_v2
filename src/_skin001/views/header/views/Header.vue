<template src="./Header.vue.html" lang="html"></template>
<style src="./Header.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Setting from "../../setting/views/Setting.vue";
import Header from "./Header";

@Component({
    components: {
        Setting,
    },
})
export default class extends Header {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
