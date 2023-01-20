<template src="./DialogMyBet.vue.html" lang="html"></template>
<style src="./DialogMyBet.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import MyBet from "../../my_bet/views/MyBet.vue";
import DialogMyBet from "./DialogMyBet";

@Component({
    components: {
        MyBet
    }
})
export default class extends DialogMyBet {}
</script>
