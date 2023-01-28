<template src="./LiveList.vue.html" lang="html"></template>
<style src="./LiveList.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Nodata from "../../widget/nodata/Nodata.vue";
import LiveListItem from "../widget/live_list_item/LiveListItem.vue";
import LiveList from "./LiveList";

@Component({
    components: {
        Nodata,
        LiveListItem,
    },
})
export default class extends LiveList {}
</script>
