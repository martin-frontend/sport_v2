<template>
    <v-app>
        <!-- <v-main>
            <router-view />
        </v-main> -->

        <v-sheet class="d-flex" color="transparent">
            <v-sheet class="overflow-y-auto" width="200" height="100vh" color="red">
                <div v-for="item in 100" :key="item">{{ item }}</div>
            </v-sheet>
            <v-sheet width="100%">
                <v-sheet height="50" color="white"></v-sheet>
                <v-sheet class="d-flex" width="100%">
                    <v-sheet class="overflow-y-auto rightbox" width="100%" color="green">
                        <div v-for="item in 100" :key="item">{{ item }}</div>
                    </v-sheet>
                    <v-sheet class="overflow-y-auto rightbox" width="200" color="yellow">
                        <div v-for="item in 100" :key="item">{{ item }}</div>
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
import NotifyMessage from "./views/widget/notify_message/NotifyMessage.vue";
@Component({
    components: {
        NotifyMessage,
    },
})
export default class extends APP {}
</script>

<style scoped lang="scss">
.rightbox {
    max-height: calc(100vh - 50px);
}
</style>
