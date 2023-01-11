<template>
    <v-app>
        <v-sheet class="d-flex" color="transparent">
            <v-sheet class="overflow-y-auto mt-3 leftbox" min-width="242" max-width="242" color="transparent" v-if="!$vuetify.breakpoint.mobile">
                <Navigation />
            </v-sheet>
            <v-sheet class="py-0" width="100%" color="transparent">
                <Header v-if="!$vuetify.breakpoint.mobile" />
                <v-sheet class="d-flex" width="100%" color="transparent" :class="{ 'mt-2': !$vuetify.breakpoint.mobile }">
                    <v-sheet
                        class="overflow-y-auto"
                        width="100%"
                        color="transparent"
                        :class="$vuetify.breakpoint.mobile ? 'mobilebox' : 'rightbox'"
                    >
                        <router-view />
                    </v-sheet>
                    <v-sheet class="overflow-y-auto rightbox" width="325" color="transparent" v-if="!$vuetify.breakpoint.mobile">
                        <PageMatche />
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
import Header from "./views/header/views/Header.vue";
import Navigation from "./views/navigation/views/Navigation.vue";
import PageMatche from "./views/page_matche/views/PageMatche.vue";
import NotifyMessage from "./views/widget/notify_message/NotifyMessage.vue";
@Component({
    components: {
        Header,
        NotifyMessage,
        Navigation,
        PageMatche,
    },
})
export default class extends APP {}
</script>

<style scoped lang="scss">
.leftbox {
    height: calc(100vh - 8px);
}
.rightbox {
    height: calc(100vh - 50px - 16px - 8px);
}
.mobilebox {
    height: 100vh;
}
</style>
