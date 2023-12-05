import net from "@/net/setting";
import { CompetitionVO } from "@/vo/CompetitionVO";
import { MenuSubCenterVO, MenuSubTopVO } from "@/vo/MenuNavVO";

export default class NavigationProxy extends puremvc.Proxy {
    static NAME = "NavigationProxy";

    public onRegister(): void {
        // this.api_menu_subnav();
        this.api_user_lovematch();
    }

    pageData = {
        bShow: false,
        lovematch: <CompetitionVO[]>[],
        menu_subnav: {
            top: <MenuSubTopVO[]>[],
            center: <MenuSubCenterVO[]>[],
            centerOpen: <boolean[]>[],
            centerLoaded: <boolean[]>[],
        },
        country_code: "", //列表中当前打开的国家

        update_count: 0,
    };

    // set_menu_subnav(data: any) {
    //     for (const item of data.center) {
    //         item.competitions = [];
    //         for (let i = 0; i < item.num; i++) {
    //             item.competitions.push({});
    //         }
    //         this.pageData.menu_subnav.centerOpen.push(false);
    //     }
    //     Object.assign(this.pageData.menu_subnav, data);

    //     this.pageData.menu_subnav.centerLoaded = [];
    //     if (this.pageData.country_code) {
    //         this.api_menu_subnav_country(this.pageData.country_code);
    //     }
    // }

    // set_menu_subnav_country(data: any, country_code: string) {
    //     const { center } = this.pageData.menu_subnav;
    //     const findIndex = center.findIndex((item) => item.country_code == country_code);
    //     if (findIndex >= 0) {
    //         center[findIndex].competitions = data;
    //         this.pageData.update_count++;
    //     }
    // }

    set_user_lovematch(data: any) {
        this.pageData.lovematch = data;
    }

    /**导航菜单 */
    api_menu_subnav() {
        this.sendNotification(net.HttpType.api_menu_subnav);
    }
    /**关注赛事列表 */
    api_user_lovematch() {
        this.sendNotification(net.HttpType.api_user_lovematch);
    }
    /**关注 */
    api_user_love(event_id: number) {
        this.sendNotification(net.HttpType.api_user_love, { event_id });
    }
    /**获取地区赛事 */
    api_menu_subnav_country(country_code: string) {
        this.pageData.country_code = country_code;
        const { center, centerLoaded } = this.pageData.menu_subnav;
        const findIndex = center.findIndex((item) => item.country_code == country_code);
        if (!centerLoaded[findIndex]) {
            this.sendNotification(net.HttpType.api_menu_subnav_country, { country_code, unique: country_code });
            centerLoaded[findIndex] = true;
        }
    }
}
