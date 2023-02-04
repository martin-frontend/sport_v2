<template src="./Help.vue.html" lang="html"></template>
<style src="./Help.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Help from "./Help";
import GeneralItem from "../widget/general_item/GeneralItem.vue";

@Component({
    components: {
        GeneralItem,
    },
})
export default class extends Help {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
