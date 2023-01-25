<template>
    <v-app>
        <v-sheet class="d-flex" color="transparent">
            <v-sheet
                class="overflow-y-auto mt-2 leftbox"
                min-width="242"
                max-width="242"
                color="transparent"
                v-if="!$vuetify.breakpoint.mobile"
            >
                <Navigation />
            </v-sheet>
            <v-sheet class="py-0" width="100%" color="transparent">
                <Header v-if="!$vuetify.breakpoint.mobile" />
                <!-- <v-sheet class="d-flex" width="100%" color="transparent" :class="{ 'mt-2': !$vuetify.breakpoint.mobile }">
                    <v-sheet
                        class="overflow-y-auto"
                        width="100%"
                        color="transparent"
                        :class="$vuetify.breakpoint.mobile ? 'mobilebox' : 'rightbox'"
                    >
                        <router-view />
                    </v-sheet>
                    <v-sheet class="overflow-y-auto rightbox mr-2" min-width="420" color="transparent" v-if="!$vuetify.breakpoint.mobile">
                        <RightPanel />
                    </v-sheet>
                </v-sheet> -->

                <v-row dense class="mt-1">
                    <v-col :cols="$vuetify.breakpoint.mobile?12:8">
                        <v-sheet
                        class="overflow-y-auto"
                        width="100%"
                        color="transparent"
                        :class="$vuetify.breakpoint.mobile ? 'mobilebox' : 'rightbox'"
                    >
                        <router-view />
                    </v-sheet>
                    </v-col>
                    <v-col cols="4">
                        <v-sheet class="overflow-y-auto rightbox mr-2" color="transparent" v-if="!$vuetify.breakpoint.mobile">
                        <RightPanel />
                    </v-sheet>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-sheet>

        <!-- dialog的挂载点 -->
        <div id="dialog_container"></div>
        <!-- 注单抽屉 -->
        <DialogMyBet/>
        <!-- 投注确认框 -->
        <DialogBetResult/>
        <!-- 消息 -->
        <NotifyMessage />
        <!-- 订单状态返回消息框 -->
        <NotifyOrderFinished />
        <!-- loading 遮罩 -->
        <overlay v-model="GlobalVar.loading" />
    </v-app>
</template>

<script lang="ts">
import getProxy from "@/core/global/getProxy";
import BetProxy from "@/proxy/BetProxy";
import Component from "vue-class-component";
import { Watch } from "vue-property-decorator";
import APP from "./App";
import DialogBetResult from "./views/dialog_bet_result/views/DialogBetResult.vue";
import DialogMyBet from "./views/dialog_my_bet/views/DialogMyBet.vue";
import Header from "./views/header/views/Header.vue";
import MyBet from "./views/my_bet/views/MyBet.vue";
import Navigation from "./views/navigation/views/Navigation.vue";
import RightPanel from "./views/right_panel/views/RightPanel.vue";
import NotifyMessage from "./views/widget/notify_message/NotifyMessage.vue";
import NotifyOrderFinished from "./views/widget/notify_order_finished/NotifyOrderFinished.vue";
@Component({
    components: {
        Header,
        NotifyMessage,
        NotifyOrderFinished,
        Navigation,
        RightPanel,
        DialogMyBet,
        MyBet,
        DialogBetResult,
    },
})
export default class extends APP {
    betProxy: BetProxy = getProxy(BetProxy);

    isShowBet = false;

    @Watch("betProxy.pageData.activeCount")
    onWatchBet() {
        this.isShowBet = this.betProxy.pageData.list.length > 0;
    }
}
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
