<template src="./PageLiveList.vue.html" lang="html"></template>
<style src="./PageLiveList.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import LiveList from "../../live_list/views/LiveList.vue";
import PageLiveList from "./PageLiveList";

@Component({
    components: {
        LiveList
    }
})
export default class extends PageLiveList {

}
</script>
