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
        const { lang, order_id, plat_id, timezone } = this.form;
        Http.post(net.HttpType.public_plat_config, { plat_id, timezone, order_id, lang }).then((response: any) => {
            PlatConfig.config = response.data;
            GlobalVar.plat_id = <any>plat_id;
            GlobalVar.zone = <any>timezone;
            GlobalVar.cdnUrl = PlatConfig.config.client.cdn_url;
            GlobalVar.lang = lang;
            LangConfig.load(this.form.lang).then(() => {
                Http.post(net.HttpType.public_order_detail_data, this.form).then((response: any) => {
                    this.init();
                    this.isloadSecLang = true;
                    this.item = response.data;
                });
            });
        });
    }
    init() {
        this.statusMap = {
            0: LangUtil("确认中"), //确认中
            1: LangUtil("确认成功"), //确认成功
            3: LangUtil("已拒绝"), //拒绝
            4: LangUtil("已取消"), //拒绝
            5: LangUtil("无效"), //无效
        };
    }
    //根据盘口展示已结算的赛果角球还是比分等
    getHadResultStr() {
        if (!this.item.real_time_state) {
            return;
        }
        const copyitem = JSON.parse(JSON.stringify(this.item));
        copyitem.state = copyitem.real_time_state;

        return OrderTitleUtils.getScoreStr(copyitem);
    }
    statusMapColor = {
        0: "#FF7128", //确认中
        1: "#007E29", //确认成功
        3: "#7E0000", //拒绝
        4: "#FF2828", //取消
    };

    // 注单状态
    statusMap = {
        0: LangUtil("确认中"), //确认中
        1: LangUtil("确认成功"), //确认成功
        3: LangUtil("已拒绝"), //拒绝
        4: LangUtil("已取消"), //拒绝
        5: LangUtil("无效"), //无效
    };
    getWinType(item: any) {
        //win_type: 1，赢，2 半赢，3 平手，4，输，5 输一半
        switch (item.win_type) {
            case 1:
                return require(`@/_skin001/assets/win_type/win.png`);
            case 2:
                return require(`@/_skin001/assets/win_type/halfwin.png`);
            case 3:
                return require(`@/_skin001/assets/win_type/draw.png`);
            case 4:
                return require(`@/_skin001/assets/win_type/lose.png`);
            case 5:
                return require(`@/_skin001/assets/win_type/halflose.png`);
        }
    }
    getWinTypeStr(item: any) {
        switch (item.win_type) {
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
        }
    }
}
