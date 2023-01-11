<template src="./PageHome.vue.html" lang="html"></template>
<style src="./PageHome.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import Nodata from "../../widget/nodata/Nodata.vue";
// import ChampionItem from "../widget/champion_item/ChampionItem.vue";
import MatcheItem from "../widget/matche_item/MatcheItem.vue";
import PageHome from "./PageHome";

@Component({
    components: {
        Nodata,
        // ChampionItem,
        MatcheItem,
    }
})
export default class extends PageHome {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
