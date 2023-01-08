<template src="./Setting.vue.html" lang="html"></template>
<style src="./Setting.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import CustomInput from "../../widget/custom_input/CustomInput.vue";
import Setting from "./Setting";

@Component({
    components:{
        CustomInput
    }
})
export default class extends Setting {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
