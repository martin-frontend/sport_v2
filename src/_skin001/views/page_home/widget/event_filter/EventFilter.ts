import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import PageHomeProxy from "../../proxy/PageHomeProxy";
import page_home from "../..";
import GlobalVar from "@/core/global/GlobalVar";
import NavigationProxy from "@/_skin001/views/navigation/proxy/NavigationProxy";

@Component
export default class EventFilter extends AbstractView {
    LangUtil = LangUtil;
    navProxy: NavigationProxy = this.getProxy(NavigationProxy);
    settingProxy: SettingProxy = this.getProxy(SettingProxy);
    myProxy: PageHomeProxy = this.getProxy(PageHomeProxy);
    pageData = this.myProxy.pageData;
    listQueryComp = this.myProxy.listQueryComp;
    selectAll = true;
    selectReverse = false;
    selectCountry: any = [];
    selectCompetion: any = {};
    allCompetition: any = {}; // 原数据 对比用
    indeterminates: any = {};
    panel: number[] = [];

    created() {
        this.curSportNav?.all_competition.forEach((item: any, index: number) => {
            this.panel.push(index);
            this.selectCountry.push(item.country_code);
            this.$set(this.selectCompetion, item.country_code, <any>[]);
            this.$set(this.allCompetition, item.country_code, <any>[]);
            this.$set(this.indeterminates, item.country_code, false);

            item.competitions.forEach((comp: any) => {
                this.selectCompetion[item.country_code].push(comp.id);
                this.allCompetition[item.country_code].push(comp.id);
            });
        });
    }

    onSave() {
        this.pageData.isShowFilter = false;
    }

    onReverse() {
        this.curSportNav?.all_competition.forEach((item: any) => {
            const arr: any = [];
            item.competitions.forEach((comp: any) => {
                if (!this.selectCompetion[item.country_code].includes(comp.id)) {
                    arr.push(comp.id);
                }
            });
            this.selectCompetion[item.country_code] = arr;
        });
    }

    onCountryClick(country_code: any) {
        if (this.selectCountry.includes(country_code)) {
            this.selectCompetion[country_code] = [...this.allCompetition[country_code]];
        } else {
            this.selectCompetion[country_code] = [];
        }
        this.indeterminates[country_code] = false;
    }

    onCompetionClick(country_code: any) {
        const length = this.selectCompetion[country_code].length;
        const totalLength = this.allCompetition[country_code].length;

        if (length == 0) {
            this.indeterminates[country_code] = false;
            this.selectCountry = this.selectCountry.filter((item: any) => item != country_code);
        } else {
            if (length == totalLength) {
                this.indeterminates[country_code] = false;
                if (!this.selectCountry.includes(country_code)) {
                    this.selectCountry.push(country_code);
                }
            } else {
                if (!this.selectCountry.includes(country_code)) {
                    this.selectCountry.push(country_code);
                }
                this.indeterminates[country_code] = true;
            }
        }
    }

    get curSportId() {
        return this.myProxy.listQueryComp.sport_id;
    }

    get curSportNav() {
        return this.navProxy.pageData.new_menu_subnav[this.curSportId];
    }

    onAll(val: boolean) {
        this.selectCountry = [];
        if (val) {
            Object.keys(this.allCompetition).forEach((country_code) => {
                this.selectCountry.push(country_code);
                this.selectCompetion[country_code] = [...this.allCompetition[country_code]];
            });
        } else {
            Object.keys(this.allCompetition).forEach((country_code) => {
                this.selectCompetion[country_code] = [];
            });
        }
    }
}
