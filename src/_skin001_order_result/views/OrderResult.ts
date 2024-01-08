import AbstractView from "@/core/abstract/AbstractView";
import { Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import { getQueryVariable } from "@/core/global/Functions";
import Http from "@/core/Http";
import net from "@/net/setting";
import PlatConfig from "@/core/config/PlatConfig";
import GlobalVar from "@/core/global/GlobalVar";
import LangConfig from "@/core/config/LangConfig";
import { TransMarketPrice, amountFormat, dateFormat, formatEventTime, getDateByTimeZone } from "@/core/global/Functions";
import OrderTitleUtils from "@/core/global/OrderTitleUtils";
import Assets from "@/_skin001/assets/Assets";

@Component
export default class PageOrderDetail extends AbstractView {
    LangUtil = LangUtil;
    dateFormat = dateFormat;
    getDateByTimeZone = getDateByTimeZone;
    amountFormat = amountFormat;
    TransMarketPrice = TransMarketPrice;
    isloadSecLang = false;
    GlobalVar = GlobalVar;
    OrderTitleUtils = OrderTitleUtils;
    item = <any>[];
    form = {
        lang: getQueryVariable("lang") || "zh_CN",
        order_id: getQueryVariable("order_id"),
        plat_id: getQueryVariable("plat_id"),
        timezone: getQueryVariable("timezone"),
        sign: getQueryVariable("sign"),
    };

    mounted() {
        this.$vuetify.theme.dark = getQueryVariable("daynight_type") == "2" ?? false;
        this.onWatchTheme();

        const { lang, order_id, plat_id, timezone } = this.form;
        Http.post(net.HttpType.public_plat_config, { plat_id, timezone, order_id, lang }).then((response: any) => {
            PlatConfig.config = response.data;
            GlobalVar.plat_id = <any>plat_id;
            GlobalVar.zone = <any>timezone;
            GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
            GlobalVar.lang = lang;
            LangConfig.load(this.form.lang).then(() => {
                console.group("%c http send >>> " + net.HttpType.public_order_detail_data_v3, "color:#cccfff;");
                console.log(this.form);
                console.groupEnd();

                Http.post(net.HttpType.public_order_detail_data_v3, this.form).then((response: any) => {
                    console.group("%c http response >>> " + net.HttpType.public_order_detail_data_v3, "color:#000bbb;");
                    console.log(JSON.parse(JSON.stringify(response)));
                    console.groupEnd();

                    if (response.status != 0) {
                        alert(response.msg);
                        // location.reload();
                    }
                    this.init();
                    this.isloadSecLang = true;
                    this.item = response.data;
                });
            });
        });
    }
    @Watch("$vuetify.theme.dark")
    onWatchTheme() {
        const html: HTMLElement = <any>document.getElementsByTagName("html")[0];
        html.style.backgroundColor = this.$vuetify.theme.dark ? "#202121" : "#f4f4f4";
    }

    init() {}

    // 注单状态
    statusMap = {
        0: LangUtil("确认中"), //确认中
        1: LangUtil("确认成功"), //确认成功
        3: LangUtil("已拒绝"), //拒绝
        4: LangUtil("已取消"), //拒绝
        5: LangUtil("无效"), //无效
        8: LangUtil("准异常"), //准异常
    };
    statusMapColor = {
        0: "#FF7128", //确认中
        1: "#007E29", //确认成功
        3: "#FF2828", //拒绝
        4: "#FF2828", //取消
        8: "#FF2828", //准异常
    };
    resultMapColor: any = {
        1: "#138723", //赢
        2: "#138723", //半赢
        3: "#138723", //和
        4: "#ff0f0e", //输
        5: "#ff0f0e", //输一半
        7: "#a2a2a2", //void
    };

    getWinTypeStr(item: any, isLeg: boolean = false) {
        const win_type = !isLeg ? item.win_type : item.selection_win_type;
        //win_type: 1，赢，2 半赢，3 平手，4，输，5 输一半
        switch (win_type) {
            case 1:
                return LangUtil("赢");
            case 2:
                return LangUtil("半赢");
            case 3:
                return LangUtil("平手");
            case 4:
                return LangUtil("输");
            case 5:
                return LangUtil("输一半");
            case 7:
                return LangUtil("失效");
        }
    }

    getWinTypeColor(item: any, isLeg: boolean = false) {
        const type = !isLeg ? item.win_type : item.selection_win_type;
        switch (type) {
            case 1:
                return "green";
            case 2:
                return "purple";
            case 3:
                return "yellow";
            case 4:
                return "red";
            case 5:
                return "blue";
            case 7:
                return "#a2a2a2";
        }
    }

    get betTypeName() {
        if (this.item.bet_type == "single") {
            return LangUtil("单关");
        }
        if (this.item.bet_type == "multi") {
            return LangUtil("串关");
        }

        return LangUtil(this.item.bet_type);
    }

    get itemColsGameInfo() {
        if (this.$vuetify.breakpoint.mobile) return 12;
        return 4;
    }
    get itemCols() {
        // if (this.$vuetify.breakpoint.xsOnly) return 12;
        if (this.$vuetify.breakpoint.mobile) return 12;
        return 3;
    }
    sportSvgIcon(sport_id: number) {
        if (sport_id) {
            return Assets.SportIcon[sport_id];
        }
        return "football";
    }
    sportTypeName(sport_id: number) {
        if (sport_id) {
            return Assets.SportNameMap[sport_id];
        }

        return this.item.sport_id || LangUtil("体育");
    }

    get sportTypeShowList() {
        if (!this.item || !this.item.leg_info) return [];
        const uniqueList = Array.from(new Set(this.item.leg_info.map((item: any) => item.sport_id)));
        const filterList = uniqueList.map((sport_id) => this.item.leg_info.find((item: any) => item.sport_id === sport_id));
        console.warn("--->>>", filterList);
        return filterList;
    }
    //根据盘口展示已结算的赛果角球还是比分等
    getHadResultStr(item: any) {
        const copyitem = JSON.parse(JSON.stringify(item));
        copyitem.state = copyitem.real_time_state;

        return OrderTitleUtils.getScoreStr(copyitem);
    }
}
