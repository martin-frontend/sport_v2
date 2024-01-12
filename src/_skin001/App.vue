<template>
    <v-app>
        <v-sheet id="page" class="d-flex overflow-x-hidden" color="transparent">
            <v-sheet
                v-if="!$vuetify.breakpoint.mobile"
                class="overflow-y-auto mt-2 leftbox scroll-div"
                :class="{ 'pb-16': $vuetify.breakpoint.mobile }"
                min-width="242"
                max-width="242"
                color="transparent"
            >
                <Navigation />
            </v-sheet>
            <v-sheet class="py-0 overflow-hidden" width="100%" color="transparent">
                <Header v-if="!$vuetify.breakpoint.mobile" />
                <template v-else>
                    <HomeMobileHeader v-if="isShowHeaderNav" />
                </template>
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
                <v-row dense :class="{ 'mt-1': !$vuetify.breakpoint.mobile }">
                    <v-col :cols="$vuetify.breakpoint.mobile || $route.path == '/page_racing_home' ? 12 : 8">
                        <v-sheet
                            id="routerBox"
                            class="overflow-y-auto overflow-x-hidden scroll-div"
                            v-scroll.self="onScroll"
                            width="100%"
                            color="transparent"
                            :class="$vuetify.breakpoint.mobile ? 'mobilebox' : 'rightbox'"
                        >
                            <HeaderNav v-if="isShowHeaderNav" class="mb-2" :class="{ 'mt-2 mx-2': $vuetify.breakpoint.mobile }" />
                            <router-view />
                        </v-sheet>
                    </v-col>
                    <v-col cols="4" v-if="!$vuetify.breakpoint.mobile && $route.path != '/page_racing_home'">
                        <v-sheet class="rightbox mr-2" color="transparent">
                            <RightPanel />
                        </v-sheet>
                    </v-col>
                </v-row>
            </v-sheet>
        </v-sheet>

        <!-- dialog的挂载点 -->
        <div id="dialog_container"></div>
        <!-- 侧边导航 -->
        <v-navigation-drawer
            v-model="GlobalVar.navDrawer"
            color="bgPage"
            app
            absolute
            temporary
            floating
            style="z-index: 101"
            v-if="$vuetify.breakpoint.mobile"
        >
            <Navigation class="mt-3" @onChange="GlobalVar.navDrawer = false" />
        </v-navigation-drawer>
        <!-- 右侧设置页 -->
        <DialogSetting />
        <!-- 注单抽屉 -->
        <DialogMyBet v-if="$vuetify.breakpoint.mobile" />
        <!-- 投注确认框 -->
        <DialogBetResult v-if="$vuetify.breakpoint.mobile" />
        <!-- 消息 -->
        <NotifyMessage />
        <!-- 订单状态返回消息框 -->
        <NotifyOrderFinished />
        <!-- 赛事筛选 -->
        <HomeMobileEventFilter v-if="$vuetify.breakpoint.mobile" />
        <RaceMobileEventFilter v-if="$vuetify.breakpoint.mobile" />
        <!-- loading 遮罩 -->
        <!-- <overlay v-model="GlobalVar.loading" /> -->
        <!-- loading 遮罩 不可见 -->
        <!-- <v-overlay :value="GlobalVar.loading1 || GlobalVar.loading" opacity="0"></v-overlay> -->
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
import { removeClass } from "@/core/global/Functions";
import DialogSetting from "./views/dialog_setting/views/DialogSetting.vue";
import HeaderNav from "./views/header/widget/header_nav/HeaderNav.vue";
import HomeMobileHeader from "./views/page_home/widget/home_mobile_header/HomeMobileHeader.vue";
import HomeMobileEventFilter from "./views/page_home/widget/mobile_event_filter/MobileEventFilter.vue";
import RaceMobileEventFilter from "./views/page_racing_home/widget/mobile_event_filter/MobileEventFilter.vue";
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
        DialogSetting,
        HeaderNav,
        HomeMobileHeader,
        HomeMobileEventFilter,
        RaceMobileEventFilter,
    },
})
export default class extends APP {
    betProxy: BetProxy = getProxy(BetProxy);

    isShowBet = false;

    get isShowHeaderNav() {
        return (
            !this.$vuetify.breakpoint.mobile ||
            (this.$vuetify.breakpoint.mobile && ["/page_home", "/page_racing_home"].includes(this.$route.path))
        );
    }

    @Watch("betProxy.pageData.activeCount")
    onWatchBet() {
        this.isShowBet = this.betProxy.pageData.list.length > 0;
    }

    onScroll() {
        const eles: any = document.getElementsByClassName("v-tooltip__content");
        for (const ele of eles) {
            removeClass(ele, "menuable__content__active");
        }
    }
}
</script>

<style scoped lang="scss">
.leftbox {
    height: calc(100vh - 16px);
}
.rightbox {
    //height: calc(100vh - 50px - 54px - 16px - 8px);
    height: calc(100vh - 50px - 16px);
}
.mobilebox {
    height: 100vh;
    padding-bottom: 80px;
}
</style>
