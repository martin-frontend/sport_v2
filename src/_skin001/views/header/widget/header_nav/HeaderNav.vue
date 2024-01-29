<template src="./HeaderNav.vue.html" lang="html"></template>
<style src="./HeaderNav.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import HeaderNav from "./HeaderNav";
import SvgaPlayer from "@/_skin001/views/widget/svga_player/SvgaPlayer.vue";

@Component({
    components: {
        SvgaPlayer
    }
})
export default class extends HeaderNav {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
