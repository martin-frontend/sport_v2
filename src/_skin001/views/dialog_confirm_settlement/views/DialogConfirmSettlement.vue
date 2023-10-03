<template src="./DialogConfirmSettlement.vue.html" lang="html"></template>
<style src="./DialogConfirmSettlement.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import DialogConfirmSettlement from "./DialogConfirmSettlement";
import DialogMessageBox from "@/_skin001/views/dialog_message_box/views/DialogMessageBox.vue";
@Component({
    components: {
        DialogMessageBox,
    },
})
export default class extends DialogConfirmSettlement {}
</script>
./DialogConfirmSettlement
