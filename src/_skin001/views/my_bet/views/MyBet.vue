<template src="./MyBet.vue.html" lang="html"></template>
<style src="./MyBet.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Nodata from "../../widget/nodata/Nodata.vue";
import MyBet from "./MyBet";

@Component({
    components: {
        Nodata,
    },
})
export default class extends MyBet {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
