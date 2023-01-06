<template>
    <v-app>
        <!-- <v-main>
            <router-view />
        </v-main> -->

        <v-sheet class="d-flex pt-3" color="transparent">
            <v-sheet class="overflow-y-auto" min-width="222" height="100vh" color="transparent">
                <Navigation/>
            </v-sheet>
            <v-sheet width="100%">
                <v-sheet height="56" color="white"></v-sheet>
                <v-sheet class="d-flex" width="100%">
                    <v-sheet class="overflow-y-auto rightbox" width="100%" color="transparent">
                        <router-view />
                    </v-sheet>
                    <v-sheet class="overflow-y-auto rightbox" width="325" color="transparent">
                        <PageMatche/>
                    </v-sheet>
                </v-sheet>
            </v-sheet>
        </v-sheet>

        <!-- dialog的挂载点 -->
        <div id="dialog_container"></div>
        <!-- 消息 -->
        <NotifyMessage />
        <!-- loading 遮罩 -->
        <v-overlay :value="GlobalVar.loading"></v-overlay>
    </v-app>
</template>

<script lang="ts">
import Component from "vue-class-component";
import APP from "./App";
import Navigation from "./views/navigation/views/Navigation.vue";
import PageMatche from "./views/page_matche/views/PageMatche.vue";
import NotifyMessage from "./views/widget/notify_message/NotifyMessage.vue";
@Component({
    components: {
        NotifyMessage,
        Navigation,
        PageMatche
    },
})
export default class extends APP {}
</script>

<style scoped lang="scss">
.rightbox {
    max-height: calc(100vh - 50px);
}
</style>
