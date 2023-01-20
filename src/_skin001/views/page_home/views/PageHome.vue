<template src="./PageHome.vue.html" lang="html"></template>
<style src="./PageHome.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Nodata from "../../widget/nodata/Nodata.vue";
import HomeHeader from "../widget/home_header/HomeHeader.vue";
import HomeMobileHeader from "../widget/home_mobile_header/HomeMobileHeader.vue";
import ChampionItem from "../widget/champion_item/ChampionItem.vue";
import MatcheItem from "../widget/matche_item/MatcheItem.vue";
import MatcheItemMobile from "../widget/matche_item_mobile/MatcheItemMobile.vue";
import PageHome from "./PageHome";

@Component({
    components: {
        Nodata,
        ChampionItem,
        MatcheItem,
        MatcheItemMobile,
        HomeMobileHeader,
        HomeHeader,
    },
})
export default class extends PageHome {}
</script>
