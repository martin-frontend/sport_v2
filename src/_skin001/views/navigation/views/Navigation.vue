<template src="./Navigation.vue.html" lang="html"></template>
<style src="./Navigation.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import MyBet from "../../my_bet/views/MyBet.vue";
import Navigation from "./Navigation";

@Component({
    components: {
        MyBet
    }
})
export default class extends Navigation {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
