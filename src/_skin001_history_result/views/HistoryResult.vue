<template src="./HistoryResult.vue.html" lang="html"></template>
<style src="./HistoryResult.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import HistoryResult from "./HistoryResult";
import NotifyMessage from "@/_skin001/views/widget/notify_message/NotifyMessage.vue";
@Component({
    components: {
        NotifyMessage
    },
})
export default class extends HistoryResult {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
