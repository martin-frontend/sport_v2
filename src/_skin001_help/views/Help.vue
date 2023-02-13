<template src="./Help.vue.html" lang="html"></template>
<style src="./Help.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Help from "./Help";


@Component({
    components: {
        
    },
})
export default class extends Help {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
