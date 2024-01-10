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
    selectCompetionLength = 0;
    allCompetition: any = {}; // 原数据 对比用
    allCompetitionLength = 0;
    indeterminates: any = {};
    panel: number[] = [];
    localStorageKey = "event_filter";

    get curSportId() {
        return this.myProxy.listQueryComp.sport_id;
    }

    get curSportNav() {
        return this.navProxy.pageData.new_menu_subnav[this.curSportId];
    }

    created() {
        this.init();
        this.getLocalStorage();
    }

    init() {
        this.curSportNav?.all_competition.forEach((item: any, index: number) => {
            this.panel.push(index);
            this.selectCountry.push(item.country_code);
            this.$set(this.selectCompetion, item.country_code, <any>[]);
            this.$set(this.allCompetition, item.country_code, <any>[]);
            this.$set(this.indeterminates, item.country_code, false);

            item.competitions.forEach((comp: any) => {
                this.selectCompetion[item.country_code].push(comp.id);
                this.allCompetition[item.country_code].push(comp.id);
                this.selectCompetionLength++;
                this.allCompetitionLength++;
            });
        });
    }

    getLocalStorage() {
        const storageData = window.localStorage.getItem(this.localStorageKey);
        if (storageData) {
            const selectCompetion = JSON.parse(storageData);
            this.selectCompetionLength = 0;
            Object.keys(selectCompetion).forEach((country_code) => {
                if (!this.selectCompetion[country_code]) return;
                this.selectCompetion[country_code] = [];
                selectCompetion[country_code]?.forEach((id: any) => {
                    if (this.allCompetition[country_code].includes(id)) {
                        this.selectCompetion[country_code].push(id);
                        this.selectCompetionLength++;
                    }
                });
                const length = this.selectCompetion[country_code].length;
                const totalLength = this.allCompetition[country_code].length;
                if (length > 0 && length < totalLength) {
                    this.indeterminates[country_code] = true;
                }
                if (length == 0) {
                    this.selectCountry = this.selectCountry.filter((countryCode: any) => countryCode != country_code);
                }
            });
        }
    }

    onSave() {
        window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.selectCompetion));
        this.pageData.isShowFilter = false;
    }

    onReverse() {
        Object.keys(this.allCompetition).forEach((country_code) => {
            const arr: any = [];
            this.allCompetition[country_code].forEach((id: any) => {
                if (!this.selectCompetion[country_code].includes(id)) {
                    arr.push(id);
                }
            });
            if (arr.length == 0) {
                this.selectCountry = this.selectCountry.filter((item: any) => item != country_code);
            } else {
                if (!this.selectCountry.includes(country_code)) {
                    this.selectCountry.push(country_code);
                }
            }
            this.selectCompetion[country_code] = arr;
        });

        this.selectCompetionLength = this.allCompetitionLength - this.selectCompetionLength;
        this.ckeckAll();
    }

    onCountryClick(country_code: any) {
        const length = this.selectCompetion[country_code].length;
        const totalLength = this.allCompetition[country_code].length;

        if (this.selectCountry.includes(country_code)) {
            this.selectCompetionLength += totalLength - length;
            this.selectCompetion[country_code] = [...this.allCompetition[country_code]];
        } else {
            this.selectCompetionLength -= length;
            this.selectCompetion[country_code] = [];
        }
        this.indeterminates[country_code] = false;
        this.ckeckAll();
    }

    onCompetionClick(country_code: any, id: any) {
        const length = this.selectCompetion[country_code].length;
        const totalLength = this.allCompetition[country_code].length;

        this.selectCompetionLength = this.selectCompetion[country_code].includes(id)
            ? this.selectCompetionLength + 1
            : this.selectCompetionLength - 1;

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
        this.ckeckAll();
    }

    onAll(val: boolean) {
        this.selectCountry = [];
        this.selectCompetionLength = val ? this.allCompetitionLength : 0;
        if (val) {
            Object.keys(this.allCompetition).forEach((country_code) => {
                this.selectCountry.push(country_code);
                this.selectCompetion[country_code] = [...this.allCompetition[country_code]];
                this.indeterminates[country_code] = false;
            });
        } else {
            Object.keys(this.allCompetition).forEach((country_code) => {
                this.selectCompetion[country_code] = [];
                this.indeterminates[country_code] = false;
            });
        }
    }

    ckeckAll() {
        this.selectAll = this.selectCompetionLength == this.allCompetitionLength;
    }
}
