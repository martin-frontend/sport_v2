<template src="./DialogSetting.vue.html" lang="html"></template>
<style src="./DialogSetting.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Setting from "../../setting/views/Setting.vue";
import CustomInput from "../../widget/custom_input/CustomInput.vue";
import DialogSetting from "./DialogSetting";

@Component({
    components: {
        Setting,
        CustomInput
    }
})
export default class extends DialogSetting {}
</script>
