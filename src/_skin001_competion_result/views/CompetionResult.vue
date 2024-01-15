<template src="./CompetionResult.vue.html" lang="html"></template>
<style src="./CompetionResult.vue.scss" lang="scss" scoped></style>

<script lang="ts">
import Component from "vue-class-component";
import CompetionResult from "./CompetionResult";
import PageGameResults from "../widget/page_game_results/views/PageGameResults.vue";
import PageRaceResults from "../widget/page_race_results/views/PageRaceResults.vue";

@Component({
    components: {
        PageGameResults,
        PageRaceResults,
    },
})
export default class extends CompetionResult {
    mounted() {
        window.scrollTo(0, 0);
    }
}
</script>
