import AbstractView from "@/core/abstract/AbstractView";
import { Prop, Watch, Component } from "vue-property-decorator";
import LangUtil from "@/core/global/LangUtil";
import SettingProxy from "@/proxy/SettingProxy";
import PageHomeProxy from "../../proxy/PageHomeProxy";
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
    totalPanel: number[] = [];
    items = <any>{};

    get curSportId() {
        return this.listQueryComp.sport_id;
    }

    get curTag() {
        return this.listQueryComp.tag;
    }

    get curSportNav() {
        return this.navProxy.pageData.new_menu_subnav[this.curSportId];
    }

    get curCompetitions() {
        const { tag } = this.listQueryComp;
        if (tag) {
            if (["inplay", "today", "future"].includes(tag)) {
                return this.curSportNav[tag].competitions;
            } else {
                const findItem = this.curSportNav.tags.find((item: any) => item.tag == tag);
                return findItem.competitions;
            }
        }
        return [];
    }

    created() {
        this.init();
        this.setData();
    }

    init() {
        let index = 0;
        this.curCompetitions.forEach((item: any) => {
            let findIndex = -1;
            const findItem = this.curSportNav?.all_competition.find((comp: any) => {
                findIndex = comp.competitions.findIndex((c: any) => c.id == item.id);
                return findIndex > -1;
            });

            this.selectCountry.push(findItem.country_code);
            if (!this.selectCompetion[findItem.country_code]) {
                this.$set(this.selectCompetion, findItem.country_code, <any>[]);
                this.$set(this.allCompetition, findItem.country_code, <any>[]);
                this.$set(this.indeterminates, findItem.country_code, false);
                this.$set(this.items, findItem.country_code, <any>{
                    ...findItem,
                    competitions: <any>[],
                });
                this.panel.push(index);
                index++;
            }
            this.items[findItem.country_code].competitions.push(item);
            this.selectCompetion[findItem.country_code].push(item.id);
            this.allCompetition[findItem.country_code].push(item.id);
            this.selectCompetionLength++;
            this.allCompetitionLength++;
        });
        this.totalPanel = [...this.panel];
    }

    setData() {
        if (this.pageData.filterCompetion) {
            const selectCompetion = JSON.parse(JSON.stringify(this.pageData.filterCompetion));
            Object.keys(selectCompetion).forEach((country_code) => {
                if (!this.selectCompetion[country_code]) return;
                this.selectCompetionLength -= this.allCompetition[country_code].length;
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
            this.ckeckAll();
        }
    }

    onSave() {
        this.pageData.filterCompetion = JSON.parse(JSON.stringify(this.selectCompetion));
        this.myProxy.api_event_list();
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

    @Watch("myProxy.pageData.isOpenFilterIndexs")
    onWatchIsOpenFilterIndexs(val: boolean) {
        if (val) {
            this.panel = [...this.totalPanel];
        } else {
            this.panel = [];
        }
    }

    @Watch("curSportId")
    onWatchCurSportId() {
        this.pageData.isShowFilter = false;
    }

    @Watch("curTag")
    onWatchCurTag() {
        this.pageData.isShowFilter = false;
    }
}
