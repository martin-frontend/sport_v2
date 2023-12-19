<template src="./LiveListItem.vue.html" lang="html"></template>
<style src="./LiveListItem.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import LiveListItem from "./LiveListItem";
import CountdownTime from "@/_skin001/views/page_racing_home/widget/countdown_time/CountdownTime.vue";

@Component({
    components: {
        CountdownTime,
    },
})
export default class extends LiveListItem {}
</script>
