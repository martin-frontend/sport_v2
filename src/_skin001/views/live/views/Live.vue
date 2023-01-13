<template src="./Live.vue.html" lang="html"></template>
<style src="./Live.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Live from "./Live";
//@ts-ignore
import LivePlayer from "@liveqing/liveplayer";

@Component({
    components: {
        LivePlayer
    }
})
export default class extends Live {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
