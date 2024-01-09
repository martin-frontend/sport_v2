<template src="./PageHome.vue.html" lang="html"></template>
<style src="./PageHome.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Nodata from "../../widget/nodata/Nodata.vue";
import HomeHeader from "../widget/home_header/HomeHeader.vue";
import ChampionItem from "../widget/champion_item/ChampionItem.vue";
import PageHome from "./PageHome";

@Component({
    components: {
        Nodata,
        ChampionItem,
        HomeHeader,
    },
})
export default class extends PageHome {}
</script>
